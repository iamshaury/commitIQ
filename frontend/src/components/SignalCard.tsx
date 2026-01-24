
import React from 'react';

interface SignalCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  colorClass: {
    bg: string;
    text: string;
  };
  percentage?: number;
}

export const SignalCard: React.FC<SignalCardProps & { compact?: boolean }> = ({ label, value, subtext, icon: Icon, colorClass, percentage, compact }) => (
  <div className={`${compact ? 'p-3' : 'p-4'} bg-white rounded-xl border border-slate-200 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-300 group flex flex-col justify-between h-full`}>
    <div>
      <div className={`flex justify-between items-start ${compact ? 'mb-2' : 'mb-3'}`}>
        <div className={`p-2 rounded-lg ${colorClass.bg} ${colorClass.text} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={compact ? 16 : 18} />
        </div>
        {typeof percentage === 'number' && (
          <span className={`text-[10px] font-bold ${colorClass.text} bg-white border border-slate-100 px-1.5 py-0.5 rounded-full`}>
            {percentage}%
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        <h4 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-slate-900 tracking-tight`}>{value}</h4>
        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
      {subtext && <p className={`${compact ? 'mt-1' : 'mt-2'} text-[10px] text-slate-400 leading-tight`}>{subtext}</p>}
    </div>

    {/* Visual Progress Bar if percentage is provided */}
    {typeof percentage === 'number' && (
      <div className={`${compact ? 'mt-2' : 'mt-3'} h-1 w-full bg-slate-100 rounded-full overflow-hidden`}>
        <div 
          className={`h-full rounded-full ${colorClass.bg.replace('bg-', 'bg-').replace('-50', '-500')}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    )}
  </div>
);
