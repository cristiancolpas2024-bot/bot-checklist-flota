import React from 'react';
import { EstadoGeneral } from '../../types/checklist';
import { AlertOctagon, CheckCircle2, AlertTriangle, Camera, Trash2, Image as ImageIcon } from 'lucide-react';

interface StepClosureProps {
  conductorCondiciones: boolean;
  vehiculoCondiciones: boolean;
  sugeridoSistema: EstadoGeneral;
  fallasCriticas: string[];
  totalNoCumple: number;
  observaciones: string;
  observacionesFotos: string[];
  firmaConductor: boolean;
  onConductorCondicionesChange: (val: boolean) => void;
  onVehiculoCondicionesChange: (val: boolean) => void;
  onObservacionesChange: (val: string) => void;
  onObservacionesFotosChange: (fotos: string[]) => void;
  onFirmaConductorChange: (val: boolean) => void;
}

export const StepClosure: React.FC<StepClosureProps> = ({
  conductorCondiciones,
  vehiculoCondiciones,
  sugeridoSistema,
  fallasCriticas,
  totalNoCumple,
  observaciones,
  observacionesFotos = [],
  firmaConductor,
  onConductorCondicionesChange,
  onVehiculoCondicionesChange,
  onObservacionesChange,
  onObservacionesFotosChange,
  onFirmaConductorChange,
}) => {
  const esRechazado =
    sugeridoSistema === 'RECHAZADO' ||
    sugeridoSistema === 'NO APTO' ||
    fallasCriticas.length > 0;

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - observacionesFotos.length;
    if (remainingSlots <= 0) return;

    const filesToRead = Array.from(files).slice(0, remainingSlots);
    const newBase64s: string[] = [];
    let completed = 0;

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) newBase64s.push(result);
        completed++;
        if (completed === filesToRead.length) {
          onObservacionesFotosChange([...observacionesFotos, ...newBase64s]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    const updated = observacionesFotos.filter((_, i) => i !== index);
    onObservacionesFotosChange(updated);
  };

  return (
    <div className="space-y-5">
      {/* Dictamen del Sistema: APROBADO / RECHAZADO */}
      {esRechazado ? (
        <div className="p-4 sm:p-5 rounded-xl bg-red-700 text-white shadow-sm">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-white shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base sm:text-lg font-bold leading-tight">
                Vehículo RECHAZADO – Reportar a supervisor
              </h3>
              <p className="text-xs sm:text-sm text-red-100 mt-1">
                Se detectaron novedades críticas. El vehículo no está autorizado para salir a ruta hasta su corrección en taller.
              </p>
            </div>
          </div>

          {fallasCriticas.length > 0 && (
            <div className="mt-3 pt-3 border-t border-red-600 text-xs">
              <p className="font-bold text-red-100 mb-1">Puntos no conformes ({fallasCriticas.length}):</p>
              <ul className="list-disc pl-4 space-y-1 text-white">
                {fallasCriticas.map((fc, i) => (
                  <li key={i}>{fc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : totalNoCumple > 0 ? (
        <div className="p-4 rounded-xl bg-amber-600 text-slate-950 shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-slate-950 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">
                Vehículo APROBADO con observaciones ({totalNoCumple} no cumple)
              </h3>
              <p className="text-xs text-slate-900 mt-0.5">
                Apto para operación. Notificar los hallazgos menores al área de mantenimiento.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-700 text-white shadow-sm">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">
                Vehículo APROBADO para operar
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Cumple con el estándar de seguridad vial y condiciones técnicas de patio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Declaración Conductor */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
        <label className="block text-sm font-bold text-slate-900">
          ¿Conductor en condiciones para operar?
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onConductorCondicionesChange(true)}
            className={`min-h-[48px] py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
              conductorCondiciones
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>SI (Apto)</span>
          </button>
          <button
            type="button"
            onClick={() => onConductorCondicionesChange(false)}
            className={`min-h-[48px] py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
              !conductorCondiciones
                ? 'bg-red-600 border-red-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>NO (No apto)</span>
          </button>
        </div>
      </div>

      {/* 2. Declaración Vehículo */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
        <label className="block text-sm font-bold text-slate-900">
          ¿Vehículo en condiciones para operar?
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onVehiculoCondicionesChange(true)}
            className={`min-h-[48px] py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
              vehiculoCondiciones
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>SI (Apto)</span>
          </button>
          <button
            type="button"
            onClick={() => onVehiculoCondicionesChange(false)}
            className={`min-h-[48px] py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
              !vehiculoCondiciones
                ? 'bg-red-600 border-red-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>NO (No apto)</span>
          </button>
        </div>
      </div>

      {/* Observaciones con Fotos Opcionales (hasta 4 fotos en collage) */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1">
            Observaciones adicionales (Opcional)
          </label>
          <textarea
            rows={3}
            placeholder="Escribe comentarios adicionales sobre el estado del camión..."
            value={observaciones}
            onChange={(e) => onObservacionesChange(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Fotos opcionales (hasta 4) y Collage */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Fotos de observaciones (Opcional - hasta 4 fotos)</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {observacionesFotos.length}/4
            </span>
          </div>

          {/* Botón de subida si faltan fotos */}
          {observacionesFotos.length < 4 && (
            <div className="mb-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-slate-600" />
                <span>
                  {observacionesFotos.length === 0
                    ? 'Tomar o subir fotos de observación'
                    : 'Agregar otra foto'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  onChange={handleAddPhoto}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Collage de Fotos */}
          {observacionesFotos.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 block font-medium">
                Collage de evidencias registradas:
              </span>
              <div
                className={`grid gap-2 rounded-xl overflow-hidden p-2 bg-slate-50 border border-slate-200 ${
                  observacionesFotos.length === 1
                    ? 'grid-cols-1'
                    : observacionesFotos.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-2'
                }`}
              >
                {observacionesFotos.map((foto, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg overflow-hidden border border-slate-300 bg-black aspect-video flex items-center justify-center"
                  >
                    <img
                      src={foto}
                      alt={`Foto observación ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600 text-white hover:bg-red-700 shadow cursor-pointer transition-colors"
                      title="Eliminar foto del collage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Declaración */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={firmaConductor}
            onChange={(e) => onFirmaConductorChange(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-slate-900 focus:ring-slate-900 border-slate-300 cursor-pointer shrink-0"
          />
          <span className="text-xs text-slate-700 leading-snug">
            Certifico bajo gravedad de juramento que la información diligenciada corresponde al estado real del vehículo y de mis condiciones al momento de la inspección.
          </span>
        </label>
      </div>
    </div>
  );
};
