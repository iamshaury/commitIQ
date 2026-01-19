import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Check } from "lucide-react";

interface HeaderProps {
  handleShare: () => void;
  isSharing: boolean;
}

export const Header = ({ handleShare, isSharing }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <nav data-html2canvas-ignore className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isSharing 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-900 hover:text-slate-900"
            }`}
          >
            {isSharing ? <Check size={14} /> : <Share2 size={14} />}
            <span>{isSharing ? "Copied" : "Share"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
