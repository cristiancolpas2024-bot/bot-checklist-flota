import React, { useState } from 'react';
import { ItemInspeccion, EstadoItem, RespuestaItem } from '../../types/checklist';
import { Check, X, Minus, Camera, Trash2, ListChecks, ArrowRight } from 'lucide-react';

interface StepInspectionProps {
  items: ItemInspeccion[];
  respuestas: Record<string, RespuestaItem>;
  onRespuestaChange: (itemId: string, update: Partial<RespuestaItem>) => void;
  onCompleteSectionAndNext: (items: ItemInspeccion[]) => void;
  showValidationErrors?: boolean;
}

export const StepInspection: React.FC<StepInspectionProps> = ({
  items,
  respuestas,
  onRespuestaChange,
  onCompleteSectionAndNext,
  showValidationErrors = false,
}) => {
  // Check if any item in this section has already been marked as NO CUMPLE
  const hasAnyNoCumple = items.some((it) => respuestas[it.id]?.estado === 'NO CUMPLE');

  // If there are validation errors or failures, default to showing all items
  const [showAllItems, setShowAllItems] = useState<boolean>(hasAnyNoCumple || showValidationErrors);

  const handleSelectEstado = (itemId: string, estado: EstadoItem) => {
    const prev = respuestas[itemId] || { estado: '' as EstadoItem };
    onRespuestaChange(itemId, {
      ...prev,
      estado,
    });
  };

  const handleFirstItemCumple = () => {
    // Fast-track: marks all items in this section as CUMPLE and advances to the next section
    onCompleteSectionAndNext(items);
  };

  const handleFirstItemNoCumple = (firstItemId: string) => {
    // If first item does not comply, expand all items so driver can document it
    setShowAllItems(true);
    handleSelectEstado(firstItemId, 'NO CUMPLE');
  };

  const handlePhotoUpload = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const prev = respuestas[itemId] || { estado: 'NO CUMPLE' };
      onRespuestaChange(itemId, {
        ...prev,
        foto: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (itemId: string) => {
    const prev = respuestas[itemId] || { estado: 'NO CUMPLE' };
    onRespuestaChange(itemId, {
      ...prev,
      foto: undefined,
    });
  };

  // If not showing all items, only render the first item with fast-fill behavior
  if (!showAllItems && items.length > 0) {
    const firstItem = items[0];
    const respuesta = respuestas[firstItem.id];
    const isAnswered = Boolean(respuesta?.estado);
    const isMissing = showValidationErrors && !isAnswered;

    return (
      <div className="space-y-4">
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                {firstItem.pregunta}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Al marcar <strong>CUMPLE</strong>, se confirma toda la sección ({items.length} puntos) y avanza a la siguiente.
              </p>
            </div>
          </div>

          {/* Action buttons on first item */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleFirstItemCumple}
              className="min-h-[50px] py-2.5 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer transition-colors"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>CUMPLE (Avanzar)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleFirstItemNoCumple(firstItem.id)}
              className="min-h-[50px] py-2.5 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 stroke-[3] text-red-600" />
              <span>NO CUMPLE</span>
            </button>
          </div>

          {isMissing && (
            <p className="text-red-600 text-xs font-semibold">
              Selecciona una opción para continuar.
            </p>
          )}

          {/* Toggle to inspect items individually */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Total puntos de la sección: {items.length}
            </span>
            <button
              type="button"
              onClick={() => setShowAllItems(true)}
              className="text-amber-800 hover:text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>Ver todos los puntos</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal view: render all items
  return (
    <div className="space-y-4">
      {/* Quick button at top if all items are shown */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs">
        <span className="text-slate-600 font-medium">
          Mostrando los {items.length} puntos de esta sección:
        </span>
        <button
          type="button"
          onClick={() => onCompleteSectionAndNext(items)}
          className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Marcar todo CUMPLE y avanzar</span>
        </button>
      </div>

      {items.map((item, index) => {
        const respuesta = respuestas[item.id];
        const isAnswered = Boolean(respuesta?.estado);
        const isNoCumple = respuesta?.estado === 'NO CUMPLE';
        const isCumple = respuesta?.estado === 'CUMPLE';
        const isNA = respuesta?.estado === 'N/A';
        const isMissing = showValidationErrors && !isAnswered;

        return (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-colors ${
              isMissing
                ? 'border-red-500 bg-red-50/30'
                : isNoCumple
                ? 'border-red-300 bg-red-50/10'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                {item.pregunta}
              </p>
            </div>

            <div className={`grid gap-2 ${item.permiteNA ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <button
                type="button"
                onClick={() => handleSelectEstado(item.id, 'CUMPLE')}
                className={`min-h-[48px] py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                  isCumple
                    ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Check className={`w-4 h-4 stroke-[3] ${isCumple ? 'text-white' : 'text-emerald-600'}`} />
                <span>CUMPLE</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectEstado(item.id, 'NO CUMPLE')}
                className={`min-h-[48px] py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                  isNoCumple
                    ? 'bg-red-600 border-red-700 text-white shadow-sm'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <X className={`w-4 h-4 stroke-[3] ${isNoCumple ? 'text-white' : 'text-red-600'}`} />
                <span>NO CUMPLE</span>
              </button>

              {item.permiteNA && (
                <button
                  type="button"
                  onClick={() => handleSelectEstado(item.id, 'N/A')}
                  className={`min-h-[48px] py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                    isNA
                      ? 'bg-slate-700 border-slate-800 text-white shadow-sm'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Minus className={`w-4 h-4 stroke-[3] ${isNA ? 'text-white' : 'text-slate-500'}`} />
                  <span>N/A</span>
                </button>
              )}
            </div>

            {isMissing && (
              <p className="text-red-600 text-xs font-semibold mt-2">
                Selecciona una opción obligatoria.
              </p>
            )}

            {isNoCumple && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Observación o hallazgo (Opcional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe la falla encontrada..."
                    value={respuesta?.comentario || ''}
                    onChange={(e) =>
                      onRespuestaChange(item.id, {
                        ...respuesta,
                        comentario: e.target.value,
                      })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  {respuesta?.foto ? (
                    <div className="relative inline-block border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <img
                        src={respuesta.foto}
                        alt="Evidencia"
                        className="w-32 h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(item.id)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white shadow hover:bg-red-700 cursor-pointer"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5 text-slate-600" />
                      <span>Adjuntar foto (opcional)</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handlePhotoUpload(item.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
