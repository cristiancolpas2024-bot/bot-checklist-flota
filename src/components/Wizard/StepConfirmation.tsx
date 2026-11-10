import React, { useState } from 'react';
import { ChecklistData } from '../../types/checklist';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  X,
  Share2,
  Printer,
  PlusCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from 'lucide-react';

interface StepConfirmationProps {
  record: ChecklistData;
  onNewChecklist: () => void;
  onPrint: () => void;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({
  record,
  onNewChecklist,
  onPrint,
}) => {
  const [copiedCadena, setCopiedCadena] = useState(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [showEvidencias, setShowEvidencias] = useState(false);

  const isAprobado =
    record.estadoFinal === 'APROBADO' || record.estadoFinal === 'APTO';
  const fechaStr =
    record.fechaAmigable ||
    new Date(record.fechaHora).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  const folioStr = record.folio || record.id || 'CKL-COL-00113';

  // Format CD display: remove "DC " if present to show e.g. "GALAPA" or "LA ARENOSA"
  const cdLimpio = (record.centroDistribucion || 'GALAPA')
    .replace(/^DC\s+/i, '')
    .trim()
    .toUpperCase();

  const tipoOperacion = (record.tipo || 'Salida').toUpperCase();
  const actaTitulo = `ACTA DE ${tipoOperacion} - ${cdLimpio}`;

  // Cadena oficial solicitada
  const finalSummaryLine = `EXITOSO - ${fechaStr} - ${record.placa} - ${folioStr} - ${record.centroDistribucion} - ${record.conductorNombre}`;

  // QR verification payload
  const qrValidationValue = JSON.stringify({
    sicl: 'SICL-BU-COL',
    folio: folioStr,
    placa: record.placa,
    cd: cdLimpio,
    operador: record.conductorNombre,
    fecha: fechaStr,
    dictamen: isAprobado ? 'APROBADO' : 'RECHAZADO',
    fallas: record.totalNoCumple,
    km: record.kilometraje,
  });

  // Mensaje para compartir por WhatsApp
  const whatsappSummary = `📋 *SISTEMA INTEGRAL DE CONTROL LOGÍSTICO (SICL)*
*${actaTitulo}*
${isAprobado ? '✅ *DICTAMEN: VEHÍCULO APROBADO*' : '❌ *DICTAMEN: VEHÍCULO RECHAZADO*'}
━━━━━━━━━━━━━━━━━━━━
• *OPERADOR:* ${record.conductorNombre} (C.C. ${record.conductorCedula})
• *FOLIO/ID:* ${folioStr}
• *FECHA:* ${fechaStr}
• *PLACA:* ${record.placa}
• *KILOMETRAJE:* ${Number(record.kilometraje).toLocaleString('es-CO')} km
• *FALLAS DETECTADAS:* ${record.totalNoCumple === 0 ? '0 (Ninguna)' : `${record.totalNoCumple} novedad(es)`}
${record.observacionesGenerales ? `• *OBSERVACIONES:* ${record.observacionesGenerales}\n` : ''}
📌 *Registro Oficial:*
${finalSummaryLine}`;

  const handleCopyCadena = () => {
    navigator.clipboard.writeText(finalSummaryLine);
    setCopiedCadena(true);
    setTimeout(() => setCopiedCadena(false), 2000);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappSummary);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleShareNative = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${actaTitulo} - ${record.placa}`,
          text: whatsappSummary,
        })
        .catch(() => {
          handleCopyWhatsApp();
        });
    } else {
      handleCopyWhatsApp();
    }
  };

  const hasFotos = record.observacionesFotos && record.observacionesFotos.length > 0;
  const hasObservaciones = Boolean(record.observacionesGenerales || hasFotos);

  return (
    <div className="space-y-5 pb-6">
      {/* =========================================================================
          PASE DIGITAL DE SALIDA VEHICULAR (Garita y Control Logístico)
          ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden font-sans">
        {/* 1. ENCABEZADO DE ESTADO (Banner Superior) */}
        <div
          className={`px-6 py-6 sm:py-7 text-center relative ${
            isAprobado ? 'bg-[#1E6B43]' : 'bg-[#991B1B]'
          }`}
        >
          {/* Icono superior centrado en círculo verde claro con borde blanco */}
          <div className="relative inline-flex items-center justify-center mb-3">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-[2.5px] border-white shadow-sm ${
                isAprobado ? 'bg-[#2E8B57]' : 'bg-[#DC2626]'
              }`}
            >
              {isAprobado ? (
                <Check className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[3.5]" />
              ) : (
                <X className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[3.5]" />
              )}
            </div>
          </div>

          {/* Título principal en blanco, negrita y mayúsculas */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white uppercase leading-snug">
            {isAprobado
              ? 'DICTAMEN DE INSPECCIÓN - VEHÍCULO APROBADO'
              : 'DICTAMEN DE INSPECCIÓN - VEHÍCULO RECHAZADO'}
          </h1>

          {/* Subtexto debajo del título */}
          <p className="text-xs sm:text-sm text-emerald-100 font-normal mt-1.5 max-w-md mx-auto leading-relaxed">
            {isAprobado
              ? 'El vehículo cumple las condiciones requeridas para operar en patio y ruta.'
              : 'El vehículo NO cumple las condiciones requeridas para operar en patio y ruta.'}
          </p>
        </div>

        {/* 2 & 3. CUERPO PRINCIPAL DEL PASE */}
        <div className="p-6 sm:p-8 bg-[#F8F9FA]/40">
          {/* 2. TÍTULO DE SECCIÓN */}
          <div className="mb-6 sm:mb-8 pb-3 border-b border-slate-200/70">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {actaTitulo}
            </h2>
          </div>

          {/* 3. ESTRUCTURA PRINCIPAL (Diseño fluido tipo pase) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* A la izquierda: Listado vertical limpio de datos clave */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              {/* OPERADOR */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Operador
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 block leading-tight">
                  {record.conductorNombre}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  C.C. {record.conductorCedula}
                </span>
              </div>

              {/* FOLIO/ID */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Folio/ID
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tracking-wide">
                  {folioStr}
                </span>
              </div>

              {/* FECHA */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Fecha
                </span>
                <span className="text-sm sm:text-base font-medium text-slate-800">
                  {fechaStr}
                </span>
              </div>

              {/* PLACA */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Placa
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-slate-950 tracking-wider inline-block">
                  {record.placa}
                </span>
              </div>

              {/* KILOMETRAJE */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Kilometraje
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                  {Number(record.kilometraje).toLocaleString('es-CO')} km
                </span>
              </div>

              {/* FALLAS DETECTADAS */}
              <div>
                <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-0.5">
                  Fallas Detectadas
                </span>
                <span
                  className={`text-sm sm:text-base font-bold ${
                    record.totalNoCumple === 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {record.totalNoCumple === 0
                    ? '0 (Ninguna)'
                    : `${record.totalNoCumple} novedad(es) registrada(s)`}
                </span>
              </div>
            </div>

            {/* A la derecha: Código QR grande y claro */}
            <div className="md:col-span-5 flex flex-col items-center justify-center pt-2 md:pt-1">
              <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center w-fit">
                <QRCodeSVG
                  value={qrValidationValue}
                  size={150}
                  level="M"
                  includeMargin={false}
                  className="w-32 h-32 sm:w-38 sm:h-38"
                />
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mt-3 max-w-[190px] leading-tight">
                Código de Validación Digital - Escanee para Verificar
              </p>
            </div>
          </div>

          {/* Sección opcional: Evidencias y Observaciones (desplegable para mantener limpieza visual) */}
          {hasObservaciones && (
            <div className="mt-6 pt-5 border-t border-slate-200/70">
              <button
                type="button"
                onClick={() => setShowEvidencias(!showEvidencias)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Observaciones y fotos registradas{' '}
                    {hasFotos ? `(${record.observacionesFotos?.length} fotos)` : ''}
                  </span>
                </span>
                {showEvidencias ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showEvidencias && (
                <div className="mt-3 space-y-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
                  {record.observacionesGenerales && (
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">
                        Observación general:
                      </span>
                      <p className="text-slate-800 italic">
                        {record.observacionesGenerales}
                      </p>
                    </div>
                  )}

                  {hasFotos && (
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-700 block">
                        Collage fotográfico adjunto:
                      </span>
                      <div
                        className={`grid gap-2 ${
                          record.observacionesFotos!.length === 1
                            ? 'grid-cols-1'
                            : 'grid-cols-2'
                        }`}
                      >
                        {record.observacionesFotos!.map((foto, idx) => (
                          <img
                            key={idx}
                            src={foto}
                            alt={`Evidencia ${idx + 1}`}
                            className="w-full h-28 object-cover rounded-lg border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. PIE DE PÁGINA (Footer) */}
        <div className="bg-[#F8F9FA] px-4 py-3.5 border-t border-slate-200/70 text-center">
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            SISTEMA INTEGRAL DE CONTROL LOGÍSTICO (SICL) - COMPROBANTE DE {tipoOperacion}
          </p>
        </div>
      </div>

      {/* =========================================================================
          BARRA DE CADENA OFICIAL CON COPIADO RÁPIDO
          ========================================================================= */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
            Registro Oficial Generado
          </span>
          <p className="font-mono text-xs font-bold text-slate-900 truncate">
            {finalSummaryLine}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyCadena}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          {copiedCadena ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* =========================================================================
          BOTONES DE ACCIÓN PARA EL CONDUCTOR / GARITA
          ========================================================================= */}
      <div className="space-y-2 pt-1">
        {/* Enviar / Copiar Resumen para WhatsApp */}
        <button
          type="button"
          onClick={handleShareNative}
          className="w-full py-3.5 px-4 rounded-xl bg-[#1E6B43] hover:bg-[#165032] active:bg-[#113E27] text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          {copiedWhatsApp ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>¡Resumen copiado para WhatsApp!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Enviar / Copiar Resumen para WhatsApp</span>
            </>
          )}
        </button>

        {/* Imprimir / Descargar Comprobante PDF */}
        <button
          type="button"
          onClick={onPrint}
          className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Imprimir / Descargar Comprobante PDF</span>
        </button>

        {/* Iniciar Nuevo Check List */}
        <button
          type="button"
          onClick={onNewChecklist}
          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Iniciar Nuevo Check List</span>
        </button>
      </div>
    </div>
  );
};
