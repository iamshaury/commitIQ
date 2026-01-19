import { Eye, Scale, Activity, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Clear GitHub Insights",
    description: "Summarizes public GitHub activity into simple, readable signals for faster technical evaluation.",
    icon: <Eye size={20} className="text-indigo-600" />,
    bg: "bg-indigo-50"
  },
  {
    title: "Transparent Scoring",
    description: "Every score is generated through open, visible rules. We prioritize logic over black-box algorithms.",
    icon: <Scale size={20} className="text-emerald-600" />,
    bg: "bg-emerald-50"
  },
  {
    title: "Skill Signals",
    description: "Identify backend patterns, architectural consistency, and project depth without bias.",
    icon: <Activity size={20} className="text-rose-600" />,
    bg: "bg-rose-50"
  },
  {
    title: "Confidence Indicators",
    description: "Assess the reliability of every insight with data-driven confidence scores and source tracking.",
    icon: <ShieldCheck size={20} className="text-amber-600" />,
    bg: "bg-amber-50"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="w-full bg-slate-50/50 border-y border-slate-200/60 backdrop-blur-sm scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 py-24">
        
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 mb-4">
            Engineering intelligence, <br/>
            <span className="text-slate-400">simplified for clarity.</span>
          </h2>
        </div>

        <div className="flex flex-col bg-slate-200/50 gap-px border border-slate-200/60 rounded-2xl overflow-hidden">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/80 p-8 group hover:bg-white transition-colors duration-300 flex flex-col md:flex-row items-start md:items-center gap-6"
            >
              <div className={`shrink-0 w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 md:mb-1 tracking-tight group-hover:text-indigo-900 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-slate-500 leading-relaxed font-normal max-w-3xl">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};