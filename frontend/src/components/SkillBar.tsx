interface SkillBarProps {
  label: string;
  score: number;
  max: number;
}

const SkillBar = ({ label, score, max }: SkillBarProps) => {
  const percentage = Math.min((score / max) * 100, 100);

  // GitHub-like progress bar colors
  const getBarColor = () => {
    if (label.toLowerCase().includes('frontend')) return 'bg-blue-500'; // GitHub Actions Blue
    if (label.toLowerCase().includes('backend')) return 'bg-purple-500'; // GitHub Purple
    return 'bg-green-500';
  };

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className="text-xs text-slate-500 font-medium">
          {score} <span className="text-slate-400">/ {max}</span>
        </span>
      </div>

      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SkillBar;