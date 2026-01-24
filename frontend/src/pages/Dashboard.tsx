import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Sparkles } from "lucide-react";

import type { AnalysisResult } from "../types";
import { StatCard } from "../components/StatCard";
import { useReportActions } from "../hooks/useReportActions";
import { githubService } from "../services/api";

import { Header } from "../features/dashboard/components/Header";
import { ProfileSection } from "../features/dashboard/components/ProfileSection";
import { MasterySection } from "../features/dashboard/components/MasterySection";

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-400 tracking-widest uppercase animate-pulse">Analyzing...</span>
    </div>
  </div>
);

export const Dashboard = () => {
  const { username } = useParams();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { isSharing, handleShare } = useReportActions();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      try {
        const data = await githubService.getProfile(username);
        setData(data);
      } catch (err: any) {
        console.error("Error fetching data", err);
        const errorMessage = err.response?.data?.details || err.response?.data?.message || err.message || "Failed to fetch analysis data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const onShareClick = async () => {
    const success = await handleShare();
    if (!success) {
       alert("Failed to copy link.");
    }
  };

  if (loading) return <LoadingState />;
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="p-6 bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 max-w-sm w-full">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Sparkles size={20} className="rotate-180" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Analysis Failed</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div ref={dashboardRef} className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      <Header 
        handleShare={onShareClick} 
        isSharing={isSharing} 
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: Profile */}
          <ProfileSection data={data} username={username} />

          {/* RIGHT COLUMN: Metrics */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 bg-slate-200/50 gap-px border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
              <StatCard label="Total Repos" value={data.totalRepos} className="!border-0 !rounded-none" />
              <StatCard label="Total Stars" value={data.totalStars} className="!border-0 !rounded-none" />
              <StatCard label="Total Forks" value={data.totalForks} className="!border-0 !rounded-none" />
              
              <div className="p-6 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/30 transition-colors" />
                 <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl -ml-10 -mb-10 group-hover:bg-rose-500/30 transition-colors" />
                 
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-400 relative z-10 flex items-center gap-2">
                    <Sparkles size={12} className="text-indigo-400" /> External Interest
                 </span>
                 <div className="flex items-baseline gap-1 relative z-10">
                    <span className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400">
                        {data.externalInterestScore}%
                    </span>
                 </div>
              </div>
            </div>

            <MasterySection data={data} />
          </div>
        </div>
      </main>
    </div>
  );
};
