import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";


function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen mesh-gradient-subtle text-slate-900 font-sans flex flex-col relative">
      
      {/* Persistent Navigation (Hidden on Dashboard) */}
      {!isDashboard && (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">CommitIQ</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Dev Analytics</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => {
                  if (location.pathname !== '/') {
                    window.location.href = '/#features';
                  } else {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Features
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className={`flex-grow ${!isDashboard ? 'max-w-6xl mx-auto px-6 py-8 w-full' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/:username" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;