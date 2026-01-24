import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturesSection } from "../features/home/components/FeaturesSection";
import { ArrowRight } from "lucide-react";

export const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (username.trim()) {
      navigate(`/dashboard/${username}`);
    }
  };

  return (
    <div className="flex flex-col items-center pt-32 pb-20 relative overflow-hidden">
      {/* Background Splash */}
      <div className="absolute top-0 left-0 w-full h-[800px] -z-10 pointer-events-none overflow-hidden">
        <img 
          src="/splash-bg.png" 
          alt="Abstract Background" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center relative z-10">
    

          <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter text-slate-900 mb-8 leading-[1.1] text-balance">
            Uncover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">DNA</span> <br/>
            of your codebase.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl font-light text-balance">
            Instant insights into architectural patterns, consistency, and mastery levels of any GitHub profile.
          </p>

          <div className="w-full max-w-lg relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white border border-slate-200 rounded-lg p-2 transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 shadow-sm">
              <input
                type="text"
                placeholder="github-username"
                className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-md font-medium transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
              >
                Analyze <ArrowRight size={16} />
              </button>
            </div>
          </div>
      </div>
      
      <div className="w-full mt-32 border-t border-slate-100">
        <FeaturesSection />
      </div>
    </div>
  );
};
