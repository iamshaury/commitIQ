import SkillBar from "../../../components/SkillBar";
import type { AnalysisResult } from "../../../types";

interface MasterySectionProps {
  data: AnalysisResult;
  activeTab: 'backend' | 'frontend';
  setActiveTab: (tab: 'backend' | 'frontend') => void;
}

export const MasterySection = ({ data, activeTab, setActiveTab }: MasterySectionProps) => {
  const currentAnalysis = activeTab === 'backend' ? data.backend : data.frontend;

  return (
    <div className="bg-white border border-slate-200">
      <div className="px-8 py-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-tight text-md">Mastery Analysis</h3>
        </div>
        
        {/* Tabs */}
         <div className="flex gap-4">
            {(['backend', 'frontend'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeTab === tab 
                    ? 'text-slate-900 border-b-2 border-slate-900 pb-1' 
                    : 'text-slate-400 hover:text-slate-600 pb-1'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8 space-y-12">
          {/* Skill Bars */}
          <div className="space-y-8">
            <SkillBar label="Frontend Mastery" score={data.frontend.score} max={100} level={data.frontend.level} />
            <SkillBar label="Backend Mastery" score={data.backend.score} max={100} level={data.backend.level} />
          </div>

          {/* Explanation Lists */}
          <div>
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                Key Insights
             </h4>
             <div className="space-y-4">
              {currentAnalysis.explanation.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-bold text-slate-800">{item.rule}</h4>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        +{item.contribution}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar within Mastery */}
        <div className="md:col-span-4 space-y-8">
          <div className="pl-8 border-l border-slate-100">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Primary Stack</h4>
            <div className="space-y-4">
              {(data.topLanguages || []).map((lang) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">{lang}</span>
                  <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 w-[70%]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
