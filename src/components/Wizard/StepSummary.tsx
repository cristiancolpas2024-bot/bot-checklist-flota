import React from 'react';
import { ChecklistData } from '../../types/checklist';
import { ITEMS_INSPECCION } from '../../config/checklistItems';
import { CheckCircle2, AlertOctagon, Send, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface StepSummaryProps {
  data: ChecklistData;
  fallasCriticas: string[];
  totalNoCumple: number;
  onConfirmSubmit: () => void;
  onGoBack: () => void;
  isSubmitting?: boolean;
}

export const StepSummary: React.FC<StepSummaryProps> = ({
  data,
  fallasCriticas,
  totalNoCumple,
  onConfirmSubmit,
  onGoBack,
  isSubmitting = false,
}) => {
  const isAprobado = data.estadoFinal === 'APROBADO' || data.estadoFinal === 'APTO';

  const noCumpleItems = ITEMS_INSPECCION.filter((item) => {
    return data.respuestas[item.id]?.estado === 'NO CUMPLE';
  });

  return (
    <div className="space-y-5">
      {/* Dictamen */}
      <div
        className={`p-5 rounded-xl text-white ${
          isAprobado ? 'bg-emerald-700' : 'bg-red-700'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/20">
            {isAprobado ? (
              <CheckCircle2 className="w-7 h-7 text-white" />
            ) : (
              <AlertOctagon className="w-7 h-7 text-white" />
            )}
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-white/80 font-bold">
              Dictamen Final
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              VEHÍCULO {isAprobado ? 'APROBADO' : 'RECHAZADO'}
            </h2>
            <p className="text-xs text-white/90 mt-0.5">
              {isAprobado
                ? 'Cumple con los requisitos de seguridad vial.'
                : 'No despachar hasta corregir las novedades técnicas detectadas.'}
            </p>
          </div>
        </div>
      </div>

      {/* Datos del Conductor y Vehículo */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Datos de Inspección
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Placa</span>
            <span className="text-base font-mono font-bold text-slate-900">{data.placa}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Kilometraje</span>
            <span className="font-mono font-bold text-slate-900">
              {Number(data.kilometraje).toLocaleString('es-CO')} km
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block text-[11px]">Tipo de Turno</span>
            <span className="font-semibold text-slate-900">{data.tipo}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-slate-500 block text-[11px]">Conductor</span>
            <span className="font-semibold text-slate-900 truncate block">
              {data.conductorNombre}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">C.C. {data.conductorCedula}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 col-span-2">
            <span className="text-slate-500 block text-[11px]">Centro de Distribución</span>
            <span className="font-semibold text-slate-900">
              {data.centroDistribucion} ({data.regional})
            </span>
          </div>
        </div>
      </div>

      {/* Conteo de Cumplimiento */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs text-emerald-800 font-bold block">Puntos Conformes</span>
          <span className="text-xl font-bold text-emerald-700">
            {ITEMS_INSPECCION.length - totalNoCumple}
          </span>
          <span className="text-[11px] text-emerald-600 block">CUMPLE</span>
        </div>

        <div
          className={`p-3 rounded-xl border ${
            totalNoCumple > 0
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <span className="text-xs font-bold block">Fallas Reportadas</span>
          <span
            className={`text-xl font-bold ${
              totalNoCumple > 0 ? 'text-red-700' : 'text-slate-700'
            }`}
          >
            {totalNoCumple}
          </span>
          <span className="text-[11px] block">NO CUMPLE</span>
        </div>
      </div>

      {/* Lista de Fallas si las hay */}
      {noCumpleItems.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/20 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wide text-red-800">
            Novedades Registradas ({noCumpleItems.length})
          </h4>

          <div className="space-y-2">
            {noCumpleItems.map((item) => {
              const resp = data.respuestas[item.id];
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-white border border-red-200 text-xs space-y-1"
                >
                  <p className="font-semibold text-slate-900">{item.pregunta}</p>
                  {resp?.comentario && (
                    <p className="text-slate-600 italic">
                      Nota: {resp.comentario}
                    </p>
                  )}
                  {resp?.foto && (
                    <div className="pt-1 flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-500">Foto adjunta:</span>
                      <img
                        src={resp.foto}
                        alt="Evidencia"
                        className="w-10 h-10 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Observaciones y Collage de fotos */}
      {(data.observacionesGenerales || (data.observacionesFotos && data.observacionesFotos.length > 0)) && (
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
          {data.observacionesGenerales && (
            <div>
              <span className="font-bold text-slate-700 block mb-0.5">Observaciones generales:</span>
              <p className="text-slate-800 italic">{data.observacionesGenerales}</p>
            </div>
          )}

          {data.observacionesFotos && data.observacionesFotos.length > 0 && (
            <div>
              <span className="font-bold text-slate-700 block mb-1.5">
                Fotos de observación ({data.observacionesFotos.length}):
              </span>
              <div
                className={`grid gap-2 ${
                  data.observacionesFotos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}
              >
                {data.observacionesFotos.map((foto, idx) => (
                  <img
                    key={idx}
                    src={foto}
                    alt={`Evidencia ${idx + 1}`}
                    className="w-full h-28 object-cover rounded-lg border border-slate-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botones de Envío */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onConfirmSubmit}
          className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
          <span>{isSubmitting ? 'Registrando Check List...' : 'Confirmar y Guardar Check List'}</span>
        </button>

        <button
          type="button"
          onClick={onGoBack}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al formulario</span>
        </button>
      </div>
    </div>
  );
};
