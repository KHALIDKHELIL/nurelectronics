import { useEffect, useState } from 'react';
import { fetchCatalog } from './services/api';
import type { Product } from './types/store';
import { Moon, Sun, Languages, Store } from 'lucide-react';
import LandingPage from './pages/LandingPage';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // App State
  const [view, setView] = useState<'landing' | 'shop'>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'OM' | 'AM'>('EN');

  useEffect(() => {
    fetchCatalog().then(setProducts).finally(() => setLoading(false));
    
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Handle Dark Mode Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Universal Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('landing')}
          >
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-500 transition">
              <Store size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                KioskMarket
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                Bale Zone
              </p>
            </div>
          </div>

          {/* Right Controls (Theme & Lang) */}
          <div className="flex items-center gap-3">
            
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
              <Languages size={14} className="ml-2 text-slate-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer py-1 pr-2"
              >
                <option value="EN">English</option>
                <option value="OM">Afaan Oromoo</option>
                <option value="AM">አማርኛ</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main>
        {loading ? (
          <div className="flex justify-center items-center h-64 text-slate-400">Loading catalog...</div>
        ) : (
          <>
            {view === 'landing' && (
              <LandingPage 
                products={products} 
                onBrowseProducts={() => setView('shop')} 
              />
            )}
            
            {view === 'shop' && (
              <div className="max-w-6xl mx-auto p-4 mt-6 text-center animate-in fade-in">
                <h2 className="text-3xl font-bold">Store Catalog goes here...</h2>
                <p className="text-slate-500 mt-2">We will paste the existing shopping grid here next!</p>
                <button 
                  onClick={() => setView('landing')}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Back to Landing Page
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}