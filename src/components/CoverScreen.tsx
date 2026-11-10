import React from 'react';
import { ArrowRight, Truck } from 'lucide-react';

interface CoverScreenProps {
  onStart: () => void;
}

export const CoverScreen: React.FC<CoverScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 sm:py-16">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden text-slate-900">
        <div className="bg-slate-900 p-6 sm:p-8 text-white border-b border-slate-800 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-500 mx-auto flex items-center justify-center text-slate-950 font-bold mb-4 shadow-sm">
            <Truck className="w-6 h-6 stroke-[2.2]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            Check List Camiones BU COL
          </h1>
          <p className="text-xs text-slate-400">
            Regional Norte • LA ARENOSA / GALAPA
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <button
            onClick={onStart}
            className="w-full py-4 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-lg tracking-tight transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-sm"
          >
            <span>Empezar ahora</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
