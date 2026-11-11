import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Moon, Sun, Languages, Store, Shield, MapPin, Phone, Clock, 
  ShieldCheck, ShoppingBag, X, Trash2, CheckCircle2, Plus, Minus
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/api';

const sendTelegramAlert = async (message: string) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; 
  
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.error("Telegram alert failed", err);
  }
};

export default function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage, cart, removeFromCart, updateQuantity, clearCart, getTrans } = useAppContext();
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.retail_price * item.quantity), 0);

  useEffect(() => { if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDarkMode(true); }, []);
  
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);
  
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const handleCheckout = async () => {
    const safeName = customerName.trim();
    const safePhone = customerPhone.trim().replace(/\s+/g, '');

    if (!safeName || /^\d+$/.test(safeName) || safeName.length < 3) return alert("Please enter a valid name.");
    const phoneRegex = /^\+?[0-9]{9,14}$/;
    if (!phoneRegex.test(safePhone)) return alert("Please enter a valid phone number.");

    setIsCheckingOut(true);
    try {
      // 1. Create Order
      const { data: orderData, error: orderError } = await supabase.from('orders').insert([{
        customer_name: safeName, customer_phone: safePhone, total_amount: cartTotal, total_price: cartTotal,
        status: 'Pending', payment_method: 'Pay at Shop'
      }]).select().single();
      
      if (orderError) throw orderError;

      // 2. Map Items & Calculate New Stock
      const orderItems = [];
      for (const item of cart) {
        orderItems.push({
          order_id: orderData.id, product_id: item.product.id, quantity: item.quantity, price_at_time: item.product.retail_price
        });
        
        // Subtract from actual database stock
        const newStock = item.product.stock_quantity - item.quantity;
        await supabase.from('products').update({ stock_quantity: newStock }).eq('id', item.product.id);
      }

      // 3. Insert Items
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      setCheckoutSuccess(true);
      sendTelegramAlert(
        `🚨 <b>NEW ORDER RESERVATION!</b>\n\n👤 <b>Customer:</b> ${safeName}\n📞 <b>Phone:</b> ${safePhone}\n💰 <b>Total:</b> ${cartTotal.toLocaleString()} ETB\n🛒 <b>Items:</b> ${cart.length}\n\n<i>Stock has been automatically subtracted.</i>`
      );

      setTimeout(() => {
        clearCart(); setIsCartOpen(false); setCheckoutSuccess(false); setCustomerName(''); setCustomerPhone('');
        window.location.reload(); 
      }, 2500);
    } catch (err: any) {
      alert("Checkout failed: " + err.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300 text-slate-900 dark:text-slate-100 flex flex-col overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"><Store size={22} /></div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">KioskMarket</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400">Bale Zone</p>
            </div>
          </div>

          <div className="hidden md:flex gap-6 font-bold text-sm text-slate-600 dark:text-slate-400">
            <Link to="/shop" className="hover:text-indigo-500 transition">Shop</Link>
            <Link to="/services" className="hover:text-indigo-500 transition">Digital Services</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-full p-1 border border-slate-200 dark:border-slate-800">
              <Languages size={14} className="ml-2 text-slate-500" />
              <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 outline-none cursor-pointer py-1 pr-2">
                <option value="EN">English</option><option value="OM">Afaan Oromoo</option><option value="AM">አማርኛ</option>
              </select>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/admin')} className="p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100 transition hidden md:block">
              <Shield size={18} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition relative ml-2 shadow-lg shadow-indigo-600/20">
              <ShoppingBag size={18} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col"><Outlet /></main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 text-white p-2 rounded-xl"><Store size={24} /></div>
              <div><h2 className="text-2xl font-black text-white">KioskMarket</h2><p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Bale Zone</p></div>
            </div>
            <p className="text-sm max-w-sm mb-6 leading-relaxed">The premier destination for genuine electronics, appliances, and professional digital services.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Contact & Hours</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-indigo-400 shrink-0" /><span>Bale Zone, Oromia</span></li>
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

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-[#111] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-black">
              <h2 className="text-2xl font-black flex items-center gap-2"><ShoppingBag size={24} className="text-indigo-500"/> Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 py-10 font-bold">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 bg-slate-50 dark:bg-black p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-white dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                      {item.product.image_url ? <img src={item.product.image_url} className="w-full h-full object-contain" /> : <Store size={24} className="text-slate-300" />}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <h4 className="font-bold text-sm line-clamp-1">{getTrans(item.product, 'name')}</h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm">{item.product.retail_price.toLocaleString()} ETB</p>
                      
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-700 rounded-lg">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:text-indigo-500 transition"><Minus size={14}/></button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:text-indigo-500 transition"><Plus size={14}/></button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.product.stock_quantity} In Stock</span>
                      </div>
                    </div>

                    <button onClick={() => removeFromCart(item.product.id)} className="text-slate-400 hover:text-red-500 transition px-2 h-fit mt-1"><Trash2 size={18} /></button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold text-slate-500">Total Price</span>
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{cartTotal.toLocaleString()} ETB</span>
                </div>

                {checkoutSuccess ? (
                  <div className="bg-emerald-500 text-white p-4 rounded-xl flex items-center gap-3 font-bold">
                    <CheckCircle2 size={24} /> Reservation Confirmed! We'll call you shortly.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Full Name" className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-indigo-500" />
                    <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Phone Number (e.g. 0911...)" className="w-full bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:border-indigo-500" />
                    <button onClick={handleCheckout} disabled={isCheckingOut} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-black py-4 rounded-xl shadow-lg transition">
                      {isCheckingOut ? 'Processing...' : 'Reserve & Pay at Shop'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}