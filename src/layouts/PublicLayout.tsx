import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Moon, Sun, Languages, Store, Shield, 
  MapPin, Phone, Clock, ShieldCheck 
} from 'lucide-react';

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'OM' | 'AM'>('EN');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true);
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Scroll to top automatically when navigating between pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Universal Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">KioskMarket</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">Bale Zone</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-full p-1 border border-slate-200 dark:border-slate-800">
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

      {/* Page Content */}
      <main className="flex-1 flex flex-col">
        <Outlet /> 
      </main>

      {/* Universal Footer (Now on every page) */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 text-white p-2 rounded-xl"><Store size={24} /></div>
              <div>
                <h2 className="text-2xl font-black text-white leading-tight">KioskMarket</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Bale Zone</p>
              </div>
            </div>
            <p className="text-sm max-w-sm mb-6 leading-relaxed">The premier destination for genuine electronics, appliances, and professional digital services in the Bale Zone.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact & Hours</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-indigo-400 shrink-0" /><span>Bale Zone, Oromia<br/>(Main Street Center)</span></li>
              <li className="flex items-center gap-3"><Phone size={18} className="text-indigo-400 shrink-0" /><span>+251 911 000 000</span></li>
              <li className="flex items-center gap-3"><Clock size={18} className="text-indigo-400 shrink-0" /><span>Mon - Sat: 8:00 AM - 6:00 PM</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800/50 text-xs flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} KioskMarket ET. All rights reserved.</p>
          <span className="flex items-center gap-1"><ShieldCheck size={14}/> Verified Business</span>
        </div>
      </footer>

    </div>
  );
}