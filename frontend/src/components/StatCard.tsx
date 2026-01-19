import { 
  BarChart3, 
  Star, 
  GitFork, 
  Layout, 
  Server, 
  Zap, 
  Boxes 
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  className?: string;
}

const getIcon = (label: string) => {
  const props = { size: 18, strokeWidth: 1.5 };
  const lower = label.toLowerCase();
  
  if (lower.includes("repo")) return <Boxes {...props} className="text-indigo-500" />;
  if (lower.includes("star")) return <Star {...props} className="text-amber-500 fill-amber-500/20" />;
  if (lower.includes("fork")) return <GitFork {...props} className="text-sky-500" />;
  if (lower.includes("front")) return <Layout {...props} className="text-pink-500" />;
  if (lower.includes("back")) return <Server {...props} className="text-violet-500" />;
  if (lower.includes("consistency")) return <Zap {...props} className="text-emerald-500 fill-emerald-500/20" />;
  return <BarChart3 {...props} className="text-slate-400" />;
};

export const StatCard = ({ 
  label, 
  value, 
  subValue,
  className
}: StatCardProps) => {

  return (
    <div className={`p-6 border border-slate-200 bg-white/60 backdrop-blur-sm flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all duration-300 group ${className}`}>
      <div className="flex items-center justify-between mb-4 text-slate-400 group-hover:text-slate-600 transition-colors">
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all">
           {getIcon(label)}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tighter text-slate-900">
          {value}
        </span>
        {subValue && (
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};