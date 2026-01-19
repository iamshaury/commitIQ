interface AnalysisBadgeProps {
  text: string;
  value?: number | string;
  color?: string; // e.g., "bg-red-100 text-red-600"
  className?: string;
}

const AnalysisBadge = ({ text, value, color, className }: AnalysisBadgeProps) => {
  // Define styles based on the level/text
  const getTheme = () => {
    if (color) return color;
    
    const lowerText = text.toLowerCase();
    if (lowerText.match(/high|strong|senior|advanced/)) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/50 dot-emerald-500";
    }
    if (lowerText.match(/moderate|mid-level|intermediate/)) {
      return "bg-amber-50 text-amber-700 border-amber-200/50 dot-amber-500";
    }
    // Default / Beginner / Junior
    return "bg-slate-50 text-slate-600 border-slate-200 dot-slate-400";
  };

  const themeClasses = getTheme();
  // Extracting the dot color manually for the indicator
  const dotColor = themeClasses.split(' ').find(c => c.startsWith('dot-'))?.replace('dot-', 'bg-');

  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      {/* The Number Value (if provided) */}
      {value !== undefined && (
        <span className="text-2xl font-bold tracking-tighter text-slate-900">
          {value}
        </span>
      )}

      {/* The Refined Badge */}
      <span className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 
        rounded-full border text-[11px] font-bold uppercase tracking-wide
        transition-all duration-300 shadow-sm
        ${themeClasses}
      `}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
        {text}
      </span>
    </div>
  );
};

export default AnalysisBadge;