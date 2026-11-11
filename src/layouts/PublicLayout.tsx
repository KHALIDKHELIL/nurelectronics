import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Moon, Sun, Languages, Store, Shield } from 'lucide-react';

export default function PublicLayout() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'OM' | 'AM'>('EN');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Universal Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-500 transition">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">KioskMarket</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">Bale Zone</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-800">
              <Languages size={14} className="ml-2 text-slate-500" />
              <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer py-1 pr-2">
                <option value="EN">English</option>
                <option value="OM">Afaan Oromoo</option>
                <option value="AM">አማርኛ</option>
              </select>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/admin')} className="p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition ml-2">
              <Shield size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Page Content injected here */}
      <main className="flex-1 flex flex-col">
        <Outlet /> 
      </main>
    </div>
  );
}