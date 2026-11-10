import React, { useState, useMemo } from 'react';
import { TipoCheckList } from '../../types/checklist';
import { CDS_NORTE, CD_NORTE, getPlacasPorCD } from '../../config/fleetData';
import { Check, Search } from 'lucide-react';

interface Step1GeneralProps {
  centroDistribucion: string;
  tipo: TipoCheckList;
  conductorNombre: string;
  conductorCedula: string;
  placa: string;
  kilometraje: number | '';
  onChange: (fields: Partial<{
    regional: 'Norte';
    centroDistribucion: string;
    tipo: TipoCheckList;
    conductorNombre: string;
    conductorCedula: string;
    placa: string;
    kilometraje: number | '';
  }>) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onBlur: (field: string) => void;
}

export const Step1General: React.FC<Step1GeneralProps> = ({
  centroDistribucion,
  tipo,
  conductorNombre,
  conductorCedula,
  placa,
  kilometraje,
  onChange,
  errors,
  touched,
  onBlur,
}) => {
  const TIPOS: TipoCheckList[] = ['Salida', 'Retorno', 'Relevo'];
  const [placaSearch, setPlacaSearch] = useState('');

  // Selected CD (defaults to LA ARENOSA if not set or invalid)
  const activeCD: CD_NORTE =
    centroDistribucion === 'GALAPA' ? 'GALAPA' : 'LA ARENOSA';

  const handleCDChange = (cd: CD_NORTE) => {
    onChange({
      regional: 'Norte',
      centroDistribucion: cd,
      // If current plate is not in the new CD's fleet, clear it
      placa: '',
    });
    setPlacaSearch('');
  };

  // Fleet list for current CD
  const fleetList = useMemo(() => {
    return getPlacasPorCD(activeCD);
  }, [activeCD]);

  // Filtered fleet for search
  const filteredFleet = useMemo(() => {
    if (!placaSearch.trim()) return fleetList;
    const term = placaSearch.toUpperCase().trim();
    return fleetList.filter((p) => p.includes(term));
  }, [fleetList, placaSearch]);

  const handlePlacaInput = (val: string) => {
    const sanitized = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    onChange({ placa: sanitized });
  };

  const handleCedulaChange = (val: string) => {
    const sanitized = val.replace(/\D/g, '').slice(0, 10);
    onChange({ conductorCedula: sanitized });
  };

  const handleKmChange = (val: string) => {
    const sanitized = val.replace(/\D/g, '');
    const num = sanitized ? parseInt(sanitized, 10) : '';
    onChange({ kilometraje: num });
  };

  return (
    <div className="space-y-5">
      {/* 1. Centro de Distribución (Solo Regional Norte: LA ARENOSA o GALAPA) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Centro de Distribución (Regional Norte)
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {CDS_NORTE.map((cd) => (
            <button
              key={cd}
              type="button"
              onClick={() => handleCDChange(cd)}
              className={`py-3 px-3 rounded-lg font-bold text-sm border transition-colors cursor-pointer text-center flex items-center justify-center gap-2 ${
                activeCD === cd
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeCD === cd && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
              <span>{cd}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Tipo de Check List */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          2. Tipo de Check List
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ tipo: t })}
              className={`py-2.5 px-2 rounded-lg font-bold text-xs sm:text-sm border transition-colors cursor-pointer text-center ${
                tipo === t
                  ? 'bg-amber-500 border-amber-600 text-slate-950 shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Nombre y Apellido del Conductor */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          3. Nombre y apellido del conductor
        </label>
        <input
          type="text"
          placeholder="Nombre y apellido completo"
          value={conductorNombre}
          onChange={(e) => onChange({ conductorNombre: e.target.value })}
          onBlur={() => onBlur('conductorNombre')}
          className={`w-full py-2.5 px-3 rounded-lg border text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
            touched.conductorNombre && errors.conductorNombre
              ? 'border-red-500 bg-red-50/20'
              : 'border-slate-300'
          }`}
        />
        {touched.conductorNombre && errors.conductorNombre && (
          <p className="text-red-600 text-xs font-semibold mt-1">
            {errors.conductorNombre}
          </p>
        )}
      </div>

      {/* 4. Cédula */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          4. Cédula del conductor
        </label>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Número de cédula (6 a 10 dígitos)"
          value={conductorCedula}
          onChange={(e) => handleCedulaChange(e.target.value)}
          onBlur={() => onBlur('conductorCedula')}
          className={`w-full py-2.5 px-3 rounded-lg border font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
            touched.conductorCedula && errors.conductorCedula
              ? 'border-red-500 bg-red-50/20'
              : 'border-slate-300'
          }`}
        />
        {touched.conductorCedula && errors.conductorCedula && (
          <p className="text-red-600 text-xs font-semibold mt-1">
            {errors.conductorCedula}
          </p>
        )}
      </div>

      {/* 5. Placa del Camión (con lista autorizada del CD) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            5. Placa del camión ({activeCD})
          </label>
          {placa && (
            <span className="text-xs font-mono font-bold text-slate-900 bg-amber-100 text-amber-950 px-2 py-0.5 rounded">
              Seleccionada: {placa}
            </span>
          )}
        </div>

        {/* Selector de Placa desde la Flota del CD */}
        <div className="space-y-2">
          <select
            value={fleetList.includes(placa) ? placa : ''}
            onChange={(e) => {
              if (e.target.value) {
                onChange({ placa: e.target.value });
              }
            }}
            onBlur={() => onBlur('placa')}
            className={`w-full py-2.5 px-3 rounded-lg border font-mono font-semibold text-xs sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 ${
              touched.placa && errors.placa
                ? 'border-red-500 bg-red-50/20'
                : 'border-slate-300'
            }`}
          >
            <option value="">-- Seleccionar placa de {activeCD} ({fleetList.length} camiones) --</option>
            {fleetList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* O escribir directamente / buscar */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 whitespace-nowrap">O escribir placa:</span>
            <input
              type="text"
              placeholder="Ej: COKSP226"
              maxLength={8}
              value={placa}
              onChange={(e) => handlePlacaInput(e.target.value)}
              onBlur={() => onBlur('placa')}
              className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-300 font-mono font-bold uppercase text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {touched.placa && errors.placa && (
          <p className="text-red-600 text-xs font-semibold mt-1">
            {errors.placa}
          </p>
        )}
      </div>

      {/* 6. Kilometraje */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          6. Kilometraje
        </label>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="Ej: 148200"
          value={kilometraje === '' ? '' : kilometraje}
          onChange={(e) => handleKmChange(e.target.value)}
          onBlur={() => onBlur('kilometraje')}
          className={`w-full py-2.5 px-3 rounded-lg border font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 ${
            touched.kilometraje && errors.kilometraje
              ? 'border-red-500 bg-red-50/20'
              : 'border-slate-300'
          }`}
        />
        {touched.kilometraje && errors.kilometraje && (
          <p className="text-red-600 text-xs font-semibold mt-1">
            {errors.kilometraje}
          </p>
        )}
      </div>
    </div>
  );
};
