import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowDownUp, Store, Zap, ArrowRight } from 'lucide-react';
import type { Product } from '../../types/store';

export default function Shop({ products = [] }: { products: Product[] }) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.name_am && p.name_am.includes(q)) ||
        (p.name_om && p.name_om.includes(q))
      );
    }
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (sortBy === 'price_asc') result.sort((a, b) => a.retail_price - b.retail_price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.retail_price - a.retail_price);
    return result;
  }, [products, searchQuery, activeCategory, sortBy]);

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-700 pb-20">
      
      {/* Premium Hero / Search Header */}
      <div className="bg-white dark:bg-[#0a0a0a] pt-8 md:pt-12 pb-6 border-b border-slate-200/60 dark:border-slate-800/60 sticky top-[60px] md:top-[68px] z-40 backdrop-blur-xl bg-white/90 dark:bg-[#0a0a0a]/90">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="flex-1 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4">
                Explore Catalog
              </h1>
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search phones, appliances, Amharic names..."
                  className="w-full bg-slate-100 dark:bg-[#111] border border-transparent dark:border-slate-800/80 rounded-2xl py-4 pl-14 pr-4 outline-none focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-lg shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-slate-50 dark:bg-[#111] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-[#1a1a1a] shadow-sm">
                <ArrowDownUp size={18} className="text-slate-500" />
              </div>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 pr-4 outline-none cursor-pointer border-none focus:ring-0"
              >
                <option value="newest">Recently Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Sleek Category Filter Bar - Scrollbar brutally hidden via CSS */}
          <div className="mt-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <SlidersHorizontal size={18} className="text-slate-400 mr-2 shrink-0 hidden md:block" />
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-slate-900/20 dark:shadow-white/20' 
                    : 'bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Refined Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 w-full">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50 dark:bg-[#111] rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 mt-6">
            <div className="bg-white dark:bg-black p-6 rounded-full shadow-sm mb-6">
              <Search size={40} className="text-slate-300 dark:text-slate-700" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No items found</h3>
            <p className="text-slate-500 max-w-sm">We couldn't find anything matching your search. Try a different term or category.</p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-8 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map(item => (
              <div 
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                className="group flex flex-col bg-white dark:bg-[#111] rounded-3xl overflow-hidden cursor-pointer border border-slate-100 dark:border-slate-800/60 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] transition-all duration-300"
              >
                {/* Premium Image Container */}
                <div className="aspect-[4/5] bg-slate-50/50 dark:bg-black relative overflow-hidden flex items-center justify-center p-6">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition duration-700 ease-out" />
                  ) : (
                    <Store size={40} className="text-slate-200 dark:text-slate-800" />
                  )}
                  
                  {/* Glassmorphic Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {item.stock_quantity > 0 && item.stock_quantity <= 5 && (
                      <span className="backdrop-blur-md bg-white/80 dark:bg-black/80 text-rose-600 dark:text-rose-500 border border-white/20 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                        <Zap size={10} className="animate-pulse" /> {item.stock_quantity} left
                      </span>
                    )}
                    {item.stock_quantity <= 0 && (
                      <span className="backdrop-blur-md bg-white/80 dark:bg-black/80 text-slate-900 dark:text-white border border-white/20 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Refined Info Section */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500">
                      {item.brand || item.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm md:text-base line-clamp-2 text-slate-900 dark:text-slate-200 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {item.name}
                  </h4>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <p className="text-indigo-600 dark:text-indigo-400 font-black text-lg">
                      {item.retail_price.toLocaleString()} <span className="text-[10px] font-bold">ETB</span>
                    </p>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} className="text-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}