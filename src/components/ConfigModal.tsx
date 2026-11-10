import React, { useState } from 'react';
import { Regional } from '../types/checklist';
import {
  DistributionCentersConfig,
  saveDistributionCenters,
  resetDistributionCenters,
} from '../config/distributionCenters';
import { Building2, Plus, Trash2, RotateCcw, Check, X, ShieldCheck } from 'lucide-react';

interface ConfigModalProps {
  currentConfig: DistributionCentersConfig;
  onSave: (newConfig: DistributionCentersConfig) => void;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  currentConfig,
  onSave,
  onClose,
}) => {
  const [activeRegional, setActiveRegional] = useState<Regional>('Sur');
  const [config, setConfig] = useState<DistributionCentersConfig>(currentConfig);
  const [newDCName, setNewDCName] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const REGIONALES: Regional[] = ['Norte', 'Sur', 'Centro', 'Andes'];

  const handleAddDC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDCName.trim()) return;

    const formatted = newDCName.trim().startsWith('DC ') ? newDCName.trim() : `DC ${newDCName.trim()}`;
    const list = config[activeRegional] || [];
    if (list.includes(formatted)) {
      setFeedback('Ese Centro de Distribución ya existe en esta regional.');
      setTimeout(() => setFeedback(''), 3000);
      return;
    }

    const updated = {
      ...config,
      [activeRegional]: [...list, formatted],
    };
    setConfig(updated);
    setNewDCName('');
    setFeedback(`¡"${formatted}" agregado a Regional ${activeRegional}!`);
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleRemoveDC = (dcName: string) => {
    const list = config[activeRegional] || [];
    const updated = {
      ...config,
      [activeRegional]: list.filter((dc) => dc !== dcName),
    };
    setConfig(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restaurar la lista oficial predeterminada de Centros de Distribución?')) {
      const reset = resetDistributionCenters();
      setConfig(reset);
      setFeedback('Listas restablecidas a valores oficiales.');
      setTimeout(() => setFeedback(''), 2500);
    }
  };

  const handleSaveAndClose = () => {
    saveDistributionCenters(config);
    onSave(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden text-slate-950">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Centros de Distribución (CD)
              </h3>
              <p className="text-xs text-slate-400">
                Configuración de sedes logísticas por regional
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Regional tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-1.5">
          {REGIONALES.map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setActiveRegional(reg)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRegional === reg
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {feedback && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Add DC Form */}
          <form onSubmit={handleAddDC} className="flex gap-2">
            <input
              type="text"
              placeholder={`Nombre nuevo CD en ${activeRegional} (Ej: DC Palmira)...`}
              value={newDCName}
              onChange={(e) => setNewDCName(e.target.value)}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Agregar</span>
            </button>
          </form>

          {/* List of DCs in active regional */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Centros habilitados en Regional {activeRegional} ({config[activeRegional]?.length || 0}):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(config[activeRegional] || []).map((dc) => (
                <div
                  key={dc}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs sm:text-sm group hover:border-slate-300"
                >
                  <span className="font-semibold text-slate-800">{dc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDC(dc)}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Predeterminados</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
