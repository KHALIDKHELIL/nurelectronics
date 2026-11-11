import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Store, ShieldCheck, MapPin, 
  MessageCircle, ShoppingBag, CheckCircle2, AlignLeft, Settings2
} from 'lucide-react';
import type { Product } from '../../types/store';
import { useAppContext } from '../../context/AppContext';

export default function ProductDetails({ products }: { products: Product[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getTrans } = useAppContext();
  
  const product = products.find(p => p.id === id);

  if (!product) return <div className="min-h-[70vh] flex justify-center items-center font-bold text-slate-500">Product Not Found</div>;

  const isOutOfStock = product.stock_quantity <= 0;
  const whatsappMsg = `Hello, I want to special order: ${product.name}`;
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;

  // Use the translation engine
  const displayName = getTrans(product, 'name');
  const displayDesc = getTrans(product, 'description');
  const displayCond = getTrans(product, 'condition');

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-500 mb-6"><ArrowLeft size={16} /> Back</button>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col lg:flex-row">
        
        <div className="lg:w-1/2 bg-slate-50/50 dark:bg-[#111] p-8 md:p-16 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          {product.image_url ? <img src={product.image_url} className="w-full max-w-lg object-contain mix-blend-multiply dark:mix-blend-normal" /> : <Store size={120} className="text-slate-200 dark:text-slate-800" />}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            {!isOutOfStock && product.stock_quantity <= 5 && <span className="bg-rose-500 text-white text-xs font-black tracking-wide px-3 py-2 rounded-xl animate-pulse">🔥 ONLY {product.stock_quantity} LEFT</span>}
            {isOutOfStock && <span className="bg-slate-900 text-white text-xs font-black tracking-wide px-3 py-2 rounded-xl">SOLD OUT</span>}
          </div>
        </div>

        <div className="lg:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full mb-3 inline-block">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-3">{displayName}</h1>
          </div>

          <div className="mb-10 bg-slate-50 dark:bg-[#111] p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
            <p className="text-4xl md:text-5xl font-black text-indigo-600 dark:text-indigo-500">{product.retail_price.toLocaleString()} <span className="text-xl font-bold text-slate-400">ETB</span></p>
          </div>

          <div className="mb-10 flex-1">
            <h3 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800"><Settings2 size={20} className="text-indigo-500"/> Specs</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {product.brand && <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Brand</span><span className="text-sm font-semibold text-slate-900 dark:text-white">{product.brand}</span></div>}
              {displayCond && <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Condition</span><span className="text-sm font-semibold text-slate-900 dark:text-white">{displayCond}</span></div>}
              {hasSpecs && Object.entries(product.specifications!).map(([key, val]) => (
                <div key={key} className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{key}</span><span className="text-sm font-semibold text-slate-900 dark:text-white">{val}</span></div>
              ))}
            </div>
          </div>

          {displayDesc && (
            <div className="mb-10 bg-slate-50/50 dark:bg-black/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
              <h3 className="font-black text-sm flex items-center gap-2 mb-3"><AlignLeft size={16} className="text-indigo-500"/> Details</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{displayDesc}</p>
            </div>
          )}

          <div className="mt-auto">
            {isOutOfStock ? (
              <button onClick={() => window.open(`https://wa.me/251911000000?text=${encodeURIComponent(whatsappMsg)}`, '_blank')} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 text-lg"><MessageCircle size={22} /> Request Special Order</button>
            ) : (
              <button onClick={() => addToCart(product)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-2 text-lg transform hover:scale-[1.02]"><ShoppingBag size={22} /> Add to Cart</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}