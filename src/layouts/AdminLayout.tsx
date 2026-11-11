import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Store, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans">
      <aside className="w-64 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-black text-indigo-600 dark:text-indigo-500">KioskMarket <span className="text-slate-900 dark:text-white">Admin</span></h1>
          <p className="text-xs text-slate-500 font-bold tracking-wider mt-1 uppercase">Bale Zone</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin/catalog" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            <Store size={20} /> Web Catalog
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
            <ShoppingBag size={20} /> Online Orders
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <Outlet />
        
        <button onClick={() => navigate('/')} className="fixed bottom-6 right-6 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-700 transition border border-slate-700 z-50">
          <ArrowLeft size={18} /> Exit Admin
        </button>
      </main>
    </div>
  );
}