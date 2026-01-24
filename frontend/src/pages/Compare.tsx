import { useState } from "react";
import { ArrowRight, Activity, CheckCircle, Layers, ShieldCheck, Trophy, Users } from "lucide-react";
import { githubService } from "../services/api";
import type { AnalysisResult } from "../types";
import { SignalCard } from "../components/SignalCard";

const CompareSearch = ({ onCompare, loading }: { onCompare: (u1: string, u2: string) => void, loading: boolean }) => {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user1 && user2) onCompare(user1, user2);
  };

  return (
    <div className="max-w-lg mx-auto mb-12">
      <div className="flex justify-center mb-4">
        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
          Battle Mode
        </span>
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2 text-center tracking-tight leading-none">
        Compare Developers
      </h1>
      <p className="text-slate-500 text-center mb-8 text-sm">Quantifying engineering impact side-by-side.</p>
      
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl shadow-slate-200/60 border border-white flex items-center gap-1">
        <input 
          type="text" 
          placeholder="User A" 
          value={user1}
          onChange={(e) => setUser1(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold p-3"
          required
        />
        <div className="w-px h-8 bg-slate-100" />
        <input 
          type="text" 
          placeholder="User B" 
          value={user2}
          onChange={(e) => setUser2(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold p-3"
          required
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight size={18} />}
        </button>
      </form>
    </div>
  );
};

export const Compare = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ user1: AnalysisResult, user2: AnalysisResult } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (u1: string, u2: string) => {
    setLoading(true);
    setError(null);
    try {
      const [res1, res2] = await Promise.all([
        githubService.getProfile(u1),
        githubService.getProfile(u2)
      ]);
      setResults({ user1: res1, user2: res2 });
    } catch (err: any) {
      setError("Unable to find profiles. Check spelling and try again.");
    } finally {
      setLoading(false);
    }
  };

  const UserColumn = ({ data, isWinner }: { data: AnalysisResult, isWinner?: boolean }) => (
    <div className={`flex flex-col gap-5 p-5 rounded-3xl transition-all duration-500 ${isWinner ? 'bg-white shadow-2xl shadow-indigo-100 ring-1 ring-indigo-50' : 'opacity-80'}`}>
      <div className="relative flex flex-col items-center">
        {isWinner && (
           <div className="absolute -top-8 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-200 flex items-center gap-1.5 animate-bounce">
              <Trophy size={12} fill="currentColor" /> Winner
           </div>
        )}
        <div className="relative">
            <img src={data.avatarUrl} alt={data.name} className="w-20 h-20 rounded-2xl mx-auto mb-3 object-cover shadow-inner ring-4 ring-slate-50" />
        </div>
        <h3 className="font-extrabold text-lg text-slate-900 truncate max-w-full">{data.name}</h3>
        <p className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mt-1">@{data.name.toLowerCase().replace(/\s/g, '')}</p>
      </div>

     <div className="grid grid-cols-3 gap-2">
        {[
            { label: 'Repos', val: data.totalRepos },
            { label: 'Stars', val: data.totalStars },
            { label: 'Forks', val: data.totalForks }
        ].map(stat => (
            <div key={stat.label} className="py-2 px-1 bg-slate-50/50 rounded-xl border border-slate-100 text-center">
                <div className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">{stat.label}</div>
                <div className="font-black text-sm text-slate-800">{stat.val}</div>
            </div>
        ))}
     </div>

      <div className="space-y-2.5">
        <SignalCard compact label="Recent Activity" value={data.activeReposLast90Days} icon={Activity} colorClass={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }} />
        <SignalCard compact label="Completion" value={`${Math.round(data.completedProjectsRatio * 100)}%`} percentage={Math.round(data.completedProjectsRatio * 100)} icon={CheckCircle} colorClass={{ bg: 'bg-blue-50', text: 'text-blue-600' }} />
        <SignalCard compact label="Core Stack" value={data.dominantLanguage || "Mixed"} percentage={Math.round(data.topStackRatio * 100)} icon={Layers} colorClass={{ bg: 'bg-violet-50', text: 'text-violet-600' }} />
        <SignalCard compact label="Code Hygiene" value={`${data.hygieneScore}/100`} percentage={data.hygieneScore} icon={ShieldCheck} colorClass={{ bg: 'bg-rose-50', text: 'text-rose-600' }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 py-12 px-6">
      <CompareSearch onCompare={handleCompare} loading={loading} />

      {error && (
         <div className="max-w-sm mx-auto p-4 bg-rose-50 text-rose-600 rounded-2xl text-center text-xs font-bold border border-rose-100 mb-8">
            {error}
         </div>
      )}

      {results && (
        <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative items-start">
                <div className="hidden md:flex absolute left-1/2 top-[100px] -translate-x-1/2 w-12 h-12 bg-slate-900 rounded-2xl items-center justify-center font-black text-xs text-white z-30 shadow-2xl shadow-slate-400 rotate-45">
                    <span className="-rotate-45">VS</span>
                </div>

                <UserColumn 
                    data={results.user1} 
                    isWinner={results.user1.hygieneScore > results.user2.hygieneScore} 
                />
                <UserColumn 
                    data={results.user2} 
                    isWinner={results.user2.hygieneScore > results.user1.hygieneScore} 
                />
            </div>
        </div>
      )}
    </div>
  );
};