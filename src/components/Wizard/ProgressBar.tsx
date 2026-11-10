import React from 'react';
import { PASOS_META } from '../../config/checklistItems';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 13,
}) => {
  const meta = PASOS_META[currentStep] || {
    paso: currentStep,
    titulo: `Paso ${currentStep}`,
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 py-2.5 text-slate-900 sticky top-[57px] z-30 shadow-xs">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-800">
              {meta.titulo}
            </span>
          </div>
          <span className="font-mono text-slate-500 text-[11px] font-bold">
            {progressPercent}%
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
