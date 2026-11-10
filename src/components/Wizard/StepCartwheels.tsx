import React from 'react';
import { CarretillaDetalle, EstadoItem } from '../../types/checklist';
import { Check, X, Camera, Trash2 } from 'lucide-react';

interface StepCartwheelsProps {
  carretilla1: CarretillaDetalle;
  carretilla2: CarretillaDetalle;
  onChangeCarretilla1: (c: CarretillaDetalle) => void;
  onChangeCarretilla2: (c: CarretillaDetalle) => void;
  showValidationErrors?: boolean;
}

export const StepCartwheels: React.FC<StepCartwheelsProps> = ({
  carretilla1,
  carretilla2,
  onChangeCarretilla1,
  onChangeCarretilla2,
  showValidationErrors = false,
}) => {
  const renderSubItem = (
    label: string,
    value: EstadoItem | undefined,
    onSelect: (val: EstadoItem) => void,
    isMissing: boolean
  ) => {
    const isCumple = value === 'CUMPLE';
    const isNoCumple = value === 'NO CUMPLE';

    return (
      <div
        className={`p-3 rounded-lg border transition-colors ${
          isMissing
            ? 'border-red-500 bg-red-50/20'
            : isNoCumple
            ? 'border-red-300 bg-red-50/10'
            : 'border-slate-200 bg-white'
        }`}
      >
        <p className="font-semibold text-xs sm:text-sm text-slate-800 mb-2">{label}</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelect('CUMPLE')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
              isCumple
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>CUMPLE</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect('NO CUMPLE')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
              isNoCumple
                ? 'bg-red-600 border-red-700 text-white'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>NO CUMPLE</span>
          </button>
        </div>
        {isMissing && (
          <p className="text-[11px] text-red-600 font-semibold mt-1">Campo obligatorio</p>
        )}
      </div>
    );
  };

  const renderCarretillaBlock = (
    num: 1 | 2,
    data: CarretillaDetalle,
    onChange: (c: CarretillaDetalle) => void
  ) => {
    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ ...data, foto: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    };

    const hasAnyNoCumple =
      data.buenEstadoGeneral === 'NO CUMPLE' ||
      data.llantasRodamientos === 'NO CUMPLE' ||
      data.etiquetaCoherente === 'NO CUMPLE';

    return (
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
        {/* Header Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              ¿Cuenta con carretilla #{num}?
            </h3>
            <p className="text-xs text-slate-500">
              Verificar asignación en camión
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:w-44">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  cuentaConCarretilla: true,
                })
              }
              className={`py-2 px-3 rounded-lg font-bold text-xs sm:text-sm border cursor-pointer transition-colors ${
                data.cuentaConCarretilla
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              SI
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  cuentaConCarretilla: false,
                })
              }
              className={`py-2 px-3 rounded-lg font-bold text-xs sm:text-sm border cursor-pointer transition-colors ${
                !data.cuentaConCarretilla
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              NO
            </button>
          </div>
        </div>

        {/* Sub-preguntas */}
        {data.cuentaConCarretilla ? (
          <div className="space-y-2.5 pt-1">
            {renderSubItem(
              'Buen estado general de estructura y pintura',
              data.buenEstadoGeneral,
              (val) => onChange({ ...data, buenEstadoGeneral: val }),
              showValidationErrors && !data.buenEstadoGeneral
            )}

            {renderSubItem(
              'Llantas y rodamientos en buen estado (giran libremente)',
              data.llantasRodamientos,
              (val) => onChange({ ...data, llantasRodamientos: val }),
              showValidationErrors && !data.llantasRodamientos
            )}

            {renderSubItem(
              'Etiqueta coherente con placa y capacidad técnica',
              data.etiquetaCoherente,
              (val) => onChange({ ...data, etiquetaCoherente: val }),
              showValidationErrors && !data.etiquetaCoherente
            )}

            {hasAnyNoCumple && (
              <div className="pt-2 space-y-2">
                <textarea
                  rows={2}
                  placeholder="Detalla la novedad en la carretilla..."
                  value={data.comentario || ''}
                  onChange={(e) => onChange({ ...data, comentario: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none"
                />

                {data.foto ? (
                  <div className="relative inline-block border rounded-lg overflow-hidden">
                    <img src={data.foto} alt="Carretilla" className="w-24 h-20 object-cover" />
                    <button
                      type="button"
                      onClick={() => onChange({ ...data, foto: undefined })}
                      className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer">
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                    <span>Foto de la carretilla (opcional)</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhoto}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            No cuenta con carretilla #{num} asignada.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderCarretillaBlock(1, carretilla1, onChangeCarretilla1)}
      {renderCarretillaBlock(2, carretilla2, onChangeCarretilla2)}
    </div>
  );
};
