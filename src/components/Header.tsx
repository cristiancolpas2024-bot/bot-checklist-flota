import React from 'react';
import { Truck } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
            <Truck className="w-4 h-4 text-slate-950 stroke-[2.4]" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-white block leading-tight">
              Check List Camiones BU COL
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Regional Norte • Logística MAZ
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
