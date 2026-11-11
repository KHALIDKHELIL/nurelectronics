import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Store, ShieldCheck, MapPin, 
  MessageCircle, ShoppingBag, CheckCircle2, AlignLeft, Settings2
} from 'lucide-react';
import type { Product } from '../../types/store';

export default function ProductDetails({ products }: { products: Product[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-500">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/')} className="text-indigo-500 font-bold hover:underline">Return to Home</button>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const whatsappMsg = `Hello KioskMarket, I would like to special order: ${product.name}`;
  
  // Safe check for specifications object
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition">
        <ArrowLeft size={16} /> Back to browsing
      </button>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left: Product Image Area */}
        <div className="lg:w-1/2 bg-slate-50/50 dark:bg-[#111] p-8 md:p-16 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full max-w-lg object-contain mix-blend-multiply dark:mix-blend-normal hover:scale-105 transition duration-700" />
          ) : (
            <Store size={120} className="text-slate-200 dark:text-slate-800" />
          )}
          
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {!isOutOfStock && product.stock_quantity <= 5 && (
              <span className="bg-rose-500 text-white text-xs font-black tracking-wide px-3 py-2 rounded-xl shadow-lg animate-pulse">
                🔥 ONLY {product.stock_quantity} LEFT
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-slate-900 text-white text-xs font-black tracking-wide px-3 py-2 rounded-xl shadow-lg">
                SOLD OUT
              </span>
            )}
            {product.condition === 'Used' && (
              <span className="bg-amber-500 text-white text-xs font-black tracking-wide px-3 py-2 rounded-xl shadow-lg">
                REFURBISHED
              </span>
            )}
          </div>
        </div>

        {/* Right: Details & Order Box */}
        <div className="lg:w-1/2 p-6 md:p-10 flex flex-col">
          
          {/* Header & Titles */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">{product.category}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-3">
              {product.name}
            </h1>
            {(product.name_am || product.name_om) && (
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                {product.name_am && <span>{product.name_am}</span>}
                {product.name_am && product.name_om && <span className="mx-2">•</span>}
                {product.name_om && <span>{product.name_om}</span>}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="mb-10 bg-slate-50 dark:bg-[#111] p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
            <p className="text-4xl md:text-5xl font-black text-indigo-600 dark:text-indigo-500">
              {product.retail_price.toLocaleString()} <span className="text-xl font-bold text-slate-400">ETB</span>
            </p>
            <p className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-1">
              <CheckCircle2 size={16} className="text-emerald-500" /> Tax included. No hidden fees.
            </p>
          </div>

          {/* Grid Layout for Specifications (Like the Screenshot) */}
          <div className="mb-10 flex-1">
            <h3 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Settings2 size={20} className="text-indigo-500"/> Tech Specs
            </h3>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {/* Always show Brand and Condition if they exist */}
              {product.brand && (
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Brand</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{product.brand}</span>
                </div>
              )}
              {product.condition && (
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">Condition</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{product.condition}</span>
                </div>
              )}
              
              {/* Dynamically map any optional features the admin added */}
              {hasSpecs && Object.entries(product.specifications!).map(([key, val]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1">{key}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* General Sentence Description Area */}
          {product.description && (
            <div className="mb-10 bg-slate-50/50 dark:bg-black/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
              <h3 className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-3">
                <AlignLeft size={16} className="text-indigo-500"/> About this item
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Sticky/Bottom Actions */}
          <div className="mt-auto">
            {isOutOfStock ? (
              <button onClick={() => window.open(`https://t.me/251941925384?text=${encodeURIComponent(whatsappMsg)}`, '_blank')} className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-black py-4 md:py-5 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex justify-center items-center gap-2 text-lg">
                <MessageCircle size={22} /> Request Special Order
              </button>
            ) : (
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 md:py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex justify-center items-center gap-2 text-lg transform hover:scale-[1.02]">
                <ShoppingBag size={22} /> Reserve for Pickup
              </button>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                <ShieldCheck size={18} className="text-emerald-500" /> Genuine Store
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                <MapPin size={18} className="text-indigo-500" /> Bale Zone, Oromia
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}