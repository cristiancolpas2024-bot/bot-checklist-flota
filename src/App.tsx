import React, { useState, useMemo } from 'react';
import {
  ChecklistData,
  TipoCheckList,
  EstadoGeneral,
  RespuestaItem,
  CarretillaDetalle,
  ItemInspeccion,
} from './types/checklist';
import {
  getItemsPorPaso,
  evaluarAptitudSugerida,
  PASOS_META,
} from './config/checklistItems';
import {
  saveChecklist,
} from './services/storage';

// Components
import { Header } from './components/Header';
import { CoverScreen } from './components/CoverScreen';
import { ProgressBar } from './components/Wizard/ProgressBar';
import { Step1General } from './components/Wizard/Step1General';
import { StepInspection } from './components/Wizard/StepInspection';
import { StepCartwheels } from './components/Wizard/StepCartwheels';
import { StepClosure } from './components/Wizard/StepClosure';
import { StepConfirmation } from './components/Wizard/StepConfirmation';
import { PrintVoucher } from './components/PrintVoucher';

import { ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'cover' | 'wizard' | 'confirmation'
  >('cover');

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [voucherToPrint, setVoucherToPrint] = useState<ChecklistData | null>(null);
  const [lastSubmittedRecord, setLastSubmittedRecord] = useState<ChecklistData | null>(null);

  // Form State (Regional Norte with LA ARENOSA or GALAPA)
  const [centroDistribucion, setCentroDistribucion] = useState<string>('LA ARENOSA');
  const [tipo, setTipo] = useState<TipoCheckList>('Salida');
  const [conductorNombre, setConductorNombre] = useState<string>('');
  const [conductorCedula, setConductorCedula] = useState<string>('');
  const [placa, setPlaca] = useState<string>('');
  const [kilometraje, setKilometraje] = useState<number | ''>('');

  // Responses for steps 2 to 11
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaItem>>({});

  // Step 12: Carretillas
  const [carretilla1, setCarretilla1] = useState<CarretillaDetalle>({
    cuentaConCarretilla: true,
    buenEstadoGeneral: undefined,
    llantasRodamientos: undefined,
    etiquetaCoherente: undefined,
  });
  const [carretilla2, setCarretilla2] = useState<CarretillaDetalle>({
    cuentaConCarretilla: false,
    buenEstadoGeneral: undefined,
    llantasRodamientos: undefined,
    etiquetaCoherente: undefined,
  });

  // Step 13: Cierre
  const [conductorCondiciones, setConductorCondiciones] = useState<boolean>(true);
  const [vehiculoCondiciones, setVehiculoCondiciones] = useState<boolean>(true);
  const [observacionesGenerales, setObservacionesGenerales] = useState<string>('');
  const [observacionesFotos, setObservacionesFotos] = useState<string[]>([]);
  const [firmaConductor, setFirmaConductor] = useState<boolean>(false);

  // Validation feedback
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showStepValidationAlert, setShowStepValidationAlert] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validation logic
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!centroDistribucion) {
        errors.centroDistribucion = 'Selecciona el Centro de Distribución (LA ARENOSA o GALAPA)';
      }
      if (!tipo) errors.tipo = 'El tipo de check list es obligatorio';

      const nameParts = conductorNombre.trim().split(/\s+/).filter(Boolean);
      if (nameParts.length < 2) {
        errors.conductorNombre = 'Ingresa nombre y apellido completo (mínimo 2 palabras)';
      }

      if (!/^\d{6,10}$/.test(conductorCedula.trim())) {
        errors.conductorCedula = 'La cédula debe contener entre 6 y 10 dígitos numéricos';
      }

      // Validates either CO + 3 letters + 3 digits (e.g. COKSP226) or 3 letters + 3 digits (e.g. KSP226)
      if (!placa.trim() || !/^([A-Z]{2})?[A-Z]{3}[0-9]{3}$/.test(placa.trim())) {
        errors.placa = 'Selecciona o escribe una placa válida (Ej: COKSP226 o KSP226)';
      }

      if (kilometraje === '' || Number(kilometraje) <= 0) {
        errors.kilometraje = 'Ingresa un kilometraje válido mayor a 0 sin puntos ni comas';
      }
    } else if (currentStep >= 2 && currentStep <= 11) {
      const itemsInStep = getItemsPorPaso(currentStep, tipo);
      itemsInStep.forEach((item) => {
        const resp = respuestas[item.id];
        if (!resp || !resp.estado) {
          errors[item.id] = `Debes responder "${item.pregunta}"`;
        }
      });
    } else if (currentStep === 12) {
      if (carretilla1.cuentaConCarretilla) {
        if (!carretilla1.buenEstadoGeneral) errors.carr1_estado = 'Requerido';
        if (!carretilla1.llantasRodamientos) errors.carr1_llantas = 'Requerido';
        if (!carretilla1.etiquetaCoherente) errors.carr1_etiqueta = 'Requerido';
      }
      if (carretilla2.cuentaConCarretilla) {
        if (!carretilla2.buenEstadoGeneral) errors.carr2_estado = 'Requerido';
        if (!carretilla2.llantasRodamientos) errors.carr2_llantas = 'Requerido';
        if (!carretilla2.etiquetaCoherente) errors.carr2_etiqueta = 'Requerido';
      }
    }

    setStepErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setShowStepValidationAlert(!isValid);
    return isValid;
  };

  const { esApto, fallasCriticas, totalNoCumple } = useMemo(() => {
    return evaluarAptitudSugerida(respuestas, conductorCondiciones, vehiculoCondiciones);
  }, [respuestas, conductorCondiciones, vehiculoCondiciones]);

  const estadoSugerido: EstadoGeneral = esApto ? 'APROBADO' : 'RECHAZADO';

  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowStepValidationAlert(false);
    if (currentStep < 13) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Direct submission to digital pass confirmation: no revision previa
      handleConfirmSubmit();
    }
  };

  const handlePrevStep = () => {
    setShowStepValidationAlert(false);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('cover');
    }
  };

  // Fast-track auto-advance: answers all items in section as CUMPLE and advances to the next section
  const handleCompleteSectionAndNext = (items: ItemInspeccion[]) => {
    setShowStepValidationAlert(false);
    setRespuestas((prev) => {
      const next = { ...prev };
      items.forEach((it) => {
        next[it.id] = { estado: 'CUMPLE' };
      });
      return next;
    });

    if (currentStep < 13) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Direct submission to digital pass confirmation: no revision previa
      handleConfirmSubmit();
    }
  };

  const handleStartFromCover = () => {
    setCurrentStep(1);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetChecklist = () => {
    setConductorNombre('');
    setConductorCedula('');
    setPlaca('');
    setKilometraje('');
    setRespuestas({});
    setCarretilla1({ cuentaConCarretilla: true });
    setCarretilla2({ cuentaConCarretilla: false });
    setConductorCondiciones(true);
    setVehiculoCondiciones(true);
    setObservacionesGenerales('');
    setObservacionesFotos([]);
    setFirmaConductor(false);
    setStepErrors({});
    setTouched({});
    setShowStepValidationAlert(false);
    setCurrentStep(1);
    setCurrentView('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    try {
      const saved = saveChecklist({
        regional: 'Norte',
        centroDistribucion,
        tipo,
        conductorNombre: conductorNombre.trim(),
        conductorCedula: conductorCedula.trim(),
        placa: placa.trim().toUpperCase(),
        kilometraje: Number(kilometraje),
        respuestas,
        carretilla1,
        carretilla2,
        conductorCondiciones,
        vehiculoCondiciones,
        sugeridoSistema: estadoSugerido,
        estadoFinal: estadoSugerido,
        totalNoCumple,
        observacionesGenerales: observacionesGenerales.trim(),
        observacionesFotos,
        firmaConductor,
      });

      setLastSubmittedRecord(saved);
      setCurrentView('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Error al guardar:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentChecklistData: ChecklistData = {
    regional: 'Norte',
    centroDistribucion,
    tipo,
    conductorNombre,
    conductorCedula,
    placa,
    kilometraje: Number(kilometraje) || 0,
    fechaHora: new Date().toISOString(),
    fechaAmigable: new Date().toLocaleString('es-CO'),
    respuestas,
    carretilla1,
    carretilla2,
    conductorCondiciones,
    vehiculoCondiciones,
    sugeridoSistema: estadoSugerido,
    estadoFinal: estadoSugerido,
    totalNoCumple,
    observacionesGenerales,
    observacionesFotos,
    firmaConductor,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header onReset={handleResetChecklist} />

      {currentView === 'wizard' && (
        <ProgressBar currentStep={currentStep} totalSteps={13} />
      )}

      <main className="flex-1 pb-24 print:pb-0">
        {currentView === 'cover' && (
          <CoverScreen onStart={handleStartFromCover} />
        )}

        {currentView === 'wizard' && (
          <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden text-slate-900 p-5 sm:p-6">
              <div className="mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {PASOS_META[currentStep]?.titulo}
                  </span>
                  <p className="text-xs text-slate-500">
                    {PASOS_META[currentStep]?.subtitulo}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {currentStep} / 13
                </span>
              </div>

              {showStepValidationAlert && (
                <div className="mb-4 p-3 rounded-lg bg-red-600 text-white text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Por favor completa todos los campos requeridos antes de continuar.</span>
                </div>
              )}

              {currentStep === 1 && (
                <Step1General
                  centroDistribucion={centroDistribucion}
                  tipo={tipo}
                  conductorNombre={conductorNombre}
                  conductorCedula={conductorCedula}
                  placa={placa}
                  kilometraje={kilometraje}
                  onChange={(fields) => {
                    if (fields.centroDistribucion !== undefined)
                      setCentroDistribucion(fields.centroDistribucion);
                    if (fields.tipo !== undefined) setTipo(fields.tipo);
                    if (fields.conductorNombre !== undefined)
                      setConductorNombre(fields.conductorNombre);
                    if (fields.conductorCedula !== undefined)
                      setConductorCedula(fields.conductorCedula);
                    if (fields.placa !== undefined) setPlaca(fields.placa);
                    if (fields.kilometraje !== undefined) setKilometraje(fields.kilometraje);
                  }}
                  errors={stepErrors}
                  touched={touched}
                  onBlur={(field) => setTouched((prev) => ({ ...prev, [field]: true }))}
                />
              )}

              {currentStep >= 2 && currentStep <= 11 && (
                <StepInspection
                  items={getItemsPorPaso(currentStep, tipo)}
                  respuestas={respuestas}
                  onRespuestaChange={(itemId, update) => {
                    setRespuestas((prev) => ({
                      ...prev,
                      [itemId]: {
                        ...prev[itemId],
                        ...update,
                      },
                    }));
                  }}
                  onCompleteSectionAndNext={handleCompleteSectionAndNext}
                  showValidationErrors={showStepValidationAlert}
                />
              )}

              {currentStep === 12 && (
                <StepCartwheels
                  carretilla1={carretilla1}
                  carretilla2={carretilla2}
                  onChangeCarretilla1={setCarretilla1}
                  onChangeCarretilla2={setCarretilla2}
                  showValidationErrors={showStepValidationAlert}
                />
              )}

              {currentStep === 13 && (
                <StepClosure
                  conductorCondiciones={conductorCondiciones}
                  vehiculoCondiciones={vehiculoCondiciones}
                  sugeridoSistema={estadoSugerido}
                  fallasCriticas={fallasCriticas}
                  totalNoCumple={totalNoCumple}
                  observaciones={observacionesGenerales}
                  observacionesFotos={observacionesFotos}
                  firmaConductor={firmaConductor}
                  onConductorCondicionesChange={setConductorCondiciones}
                  onVehiculoCondicionesChange={setVehiculoCondiciones}
                  onObservacionesChange={setObservacionesGenerales}
                  onObservacionesFotosChange={setObservacionesFotos}
                  onFirmaConductorChange={setFirmaConductor}
                />
              )}
            </div>
          </div>
        )}

        {currentView === 'confirmation' && lastSubmittedRecord && (
          <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <StepConfirmation
              record={lastSubmittedRecord}
              onNewChecklist={handleResetChecklist}
              onPrint={() => setVoucherToPrint(lastSubmittedRecord)}
            />
          </div>
        )}
      </main>

      {/* Sticky Bottom Navigation Bar during Wizard */}
      {currentView === 'wizard' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xs border-t border-slate-200 p-3 shadow-md">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrevStep}
              className="py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs font-mono font-semibold text-slate-500 hidden xs:inline">
              Paso {currentStep} de 13
            </span>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleNextStep}
              className={`py-2.5 px-6 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs ${
                currentStep === 13
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              } disabled:opacity-50`}
            >
              <span>
                {currentStep === 13
                  ? isSubmitting
                    ? 'Finalizando...'
                    : 'Finalizar y Generar Pase'
                  : 'Siguiente'}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}

      {voucherToPrint && (
        <PrintVoucher
          record={voucherToPrint}
          onClose={() => setVoucherToPrint(null)}
        />
      )}
    </div>
  );
}
