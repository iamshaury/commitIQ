import { Activity, CheckCircle, Code2, Layers, Star, Calendar, ShieldCheck } from "lucide-react";
import type { AnalysisResult } from "../../../types";

import { SignalCard } from "../../../components/SignalCard";

interface MasterySectionProps {
  data: AnalysisResult;
}

export const MasterySection = ({ data }: MasterySectionProps) => {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">Signal Analysis</h3>
            <p className="text-xs text-slate-500">Key performance indicators derived from repository data.</p>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        {/* 1. Recency - No progress bar, just count */}
        <SignalCard 
          label="Recent Activity" 
          value={data.activeReposLast90Days}
          subtext="Active repos (90d)"
          icon={Activity}
          colorClass={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
        />

        {/* 2. Completion - Progress */}
        <SignalCard 
          label="Completion Ratio" 
          value={data.completedProjectsRatio > 0.8 ? "High" : data.completedProjectsRatio > 0.4 ? "Mid" : "Low"}
          percentage={Math.round(data.completedProjectsRatio * 100)}
          subtext="Docs & deploy"
          icon={CheckCircle}
          colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
        />

        {/* 3. Focus - Progress */}
        <SignalCard 
          label="Stack Focus" 
          value={data.dominantLanguage || "Mixed"}
          percentage={Math.round(data.topStackRatio * 100)}
          subtext={`Aligned to stack`}
          icon={Layers}
          colorClass={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }}
        />

        {/* 4. Project Depth - Count */}
        <SignalCard 
          label="Deep Projects" 
          value={data.deepProjectCount}
          subtext="Complex codebases"
          icon={Code2}
          colorClass={{ bg: 'bg-violet-50', text: 'text-violet-600' }}
        />

         {/* 5. Validation - Score (0-100 ish) */}
        <SignalCard 
          label="Community Interest" 
          value={data.externalInterestScore > 75 ? "Viral" : data.externalInterestScore > 25 ? "Noticed" : "Quiet"}
          percentage={data.externalInterestScore} // Assuming score is 0-100-ish
          subtext={`Stars & forks`}
          icon={Star}
          colorClass={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
        />

        {/* 6. Consistency - Progress (X/12) */}
         <SignalCard 
          label="Consistency" 
          value={`${data.activeMonthsLast12} mos`}
          percentage={Math.round((data.activeMonthsLast12 / 12) * 100)}
          subtext="Active months (1y)"
          icon={Calendar}
          colorClass={{ bg: 'bg-rose-50', text: 'text-rose-600' }}
        />

         {/* 7. Hygiene - Progress */}
         <SignalCard 
          label="Hygiene Score" 
          value={data.hygieneScore > 80 ? "Great" : data.hygieneScore > 50 ? "Good" : "Fair"}
          percentage={data.hygieneScore}
          subtext="Project quality"
          icon={ShieldCheck}
          colorClass={{ bg: 'bg-teal-50', text: 'text-teal-600' }}
        />

      </div>

      {/* AI Summary Section */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white relative overflow-hidden shadow-lg shadow-indigo-900/10">
         <div className="relative z-10">
           <div className="flex items-center gap-3 mb-3">
             <div className="p-1.5 bg-indigo-500/20 rounded-md backdrop-blur-sm border border-indigo-500/30">
                <SparklesIcon />
             </div>
             <div>
                <h4 className="text-sm font-bold">Recruiter Intelligence</h4>
             </div>
           </div>
           <p className="text-slate-300 leading-relaxed text-xs lg:text-sm max-w-4xl font-light tracking-wide">
             {data.aiSummary}
           </p>
         </div>
         
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
      </div>

    </div>
  );
};

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.39 9.39L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.39L12 2Z" fill="currentColor"/>
  </svg>
);
