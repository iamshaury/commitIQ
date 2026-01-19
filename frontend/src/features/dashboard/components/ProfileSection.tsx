import { Sparkles } from "lucide-react";
import type { AnalysisResult } from "../../../types";

interface ProfileSectionProps {
  data: AnalysisResult;
  username: string | undefined;
}

export const ProfileSection = ({ data, username }: ProfileSectionProps) => {
  return (
    <aside className="lg:col-span-4 space-y-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-32 h-32 mb-6 rounded-full border border-slate-200 p-1">
           <img 
            src={data.avatarUrl || `https://ui-avatars.com/api/?name=${username}`} 
            className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500" // Interactive element
            alt="avatar"
            crossOrigin="anonymous" 
          />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{data.name || username}</h2>
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm font-medium text-slate-500">@{username}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
           <span className="px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Active
          </span>
        </div>

        {/* Minimal AI Summary */}
        <div className="w-full text-left p-6 border-y border-slate-200 bg-slate-50/30">
           <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Verdict</h3>
            </div>
          <p className="text-sm leading-relaxed text-slate-600 font-normal">
            {data.aiSummary}
          </p>
        </div>

        {/* Clean Stats Row */}
        <div className="w-full grid grid-cols-2 text-left border-b border-slate-200 divide-x divide-slate-200 bg-white">
           <div className="p-6 group hover:bg-slate-50 transition-colors">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-amber-500 transition-colors">Level</p>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-bold text-slate-900">{data.seriousProjectsLevel}</span>
              </div>
           </div>
           
           <div className="p-6 group hover:bg-slate-50 transition-colors">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Consistency</p>
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-slate-900">{data.consistencyScore}%</span>
              </div>
           </div>
        </div>

      </div>
    </aside>
  );
};
