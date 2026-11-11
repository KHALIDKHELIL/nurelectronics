import { useState, useEffect } from 'react';
import { ShoppingBag, Globe, CheckCircle2, XCircle, Clock, Download, Phone } from 'lucide-react';
import { supabase } from '../../services/api';

export default function Orders() {
  const [activeTab, setActiveTab] = useState<'shop' | 'services'>('shop');
  
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [resOrders, resItems, resProds, resServs] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('order_items').select('*'),
        supabase.from('products').select('id, name, image_url'),
        supabase.from('service_requests').select('*').order('created_at', { ascending: false })
      ]);

      if (resOrders.data) setOrders(resOrders.data);
      if (resItems.data) setOrderItems(resItems.data);
      if (resProds.data) setProducts(resProds.data);
      if (resServs.data) setServices(resServs.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const updateServiceStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('service_requests').update({ status: newStatus }).eq('id', id);
    if (!error) setServices(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'Completed') return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">Completed</span>;
    if (status === 'Cancelled') return <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">Cancelled</span>;
    return <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1"><Clock size={10}/> Pending</span>;
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Fulfillment Center</h2>
          <p className="text-slate-500 mt-2">Manage customer reservations and digital services.</p>
        </div>
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setActiveTab('shop')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'shop' ? 'bg-white dark:bg-[#111] text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <ShoppingBag size={18} /> Shop Orders
          </button>
          <button onClick={() => setActiveTab('services')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'services' ? 'bg-white dark:bg-[#111] text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Globe size={18} /> Digital Services
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Syncing live data...</div>
      ) : activeTab === 'shop' ? (
        
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 p-20 text-center text-slate-500">No shop orders yet.</div>
          ) : orders.map(order => {
            const myItems = orderItems.filter(i => i.order_id === order.id).map(item => {
              const product = products.find(p => p.id === item.product_id);
              return { ...item, product_name: product?.name || 'Unknown Product' };
            });

            return (
              <div key={order.id} className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row mb-4">
                <div className="p-4 md:p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <StatusBadge status={order.status} />
                      <h3 className="text-lg font-black mt-2 text-slate-900 dark:text-white leading-none">{order.customer_name}</h3>
                      <p className="flex items-center gap-1.5 text-slate-500 font-bold mt-1.5 text-xs"><Phone size={12}/> {order.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{order.total_amount?.toLocaleString()} ETB</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-black rounded-lg p-3 border border-slate-100 dark:border-slate-800">
                    <ul className="space-y-1">
                      {myItems.map(item => (
                        <li key={item.id} className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>{item.quantity}x {item.product_name}</span>
                          <span className="text-slate-500">{item.price_at_time?.toLocaleString()} ETB</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#1a1a1a] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-4 flex flex-row md:flex-col justify-center gap-2 w-full md:w-40">
                  {order.status === 'Pending' ? (
                    <>
                      <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-sm"><CheckCircle2 size={16}/> Complete</button>
                      <button onClick={() => updateOrderStatus(order.id, 'Cancelled')} className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-sm"><XCircle size={16}/> Cancel</button>
                    </>
                  ) : (
                    <div className="text-center font-bold text-slate-400 text-xs uppercase tracking-wider">Processed</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      ) : (

        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 p-20 text-center text-slate-500">No service requests yet.</div>
          ) : services.map(service => (
            <div key={service.id} className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row mb-4">
              <div className="p-4 md:p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <StatusBadge status={service.status} />
                    <h3 className="text-lg font-black mt-2 text-slate-900 dark:text-white leading-none">{service.customer_name}</h3>
                    <p className="flex items-center gap-1.5 text-slate-500 font-bold mt-1.5 text-xs"><Phone size={12}/> {service.customer_phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">{service.service_type}</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">{new Date(service.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {service.notes && (
                  <p className="text-xs bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500 p-3 rounded-lg font-medium border border-amber-200 dark:border-amber-900/30">
                    <span className="font-black uppercase tracking-widest text-[9px] block mb-0.5">Notes</span>
                    {service.notes}
                  </p>
                )}
              </div>
              
              <div className="bg-slate-50 dark:bg-[#1a1a1a] border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 p-4 flex flex-row md:flex-col justify-center gap-2 w-full md:w-48">
                {service.file_url ? (
                  <button onClick={() => window.open(service.file_url, '_blank')} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition hover:scale-105 shadow-md text-sm"><Download size={16}/> View File</button>
                ) : (
                  <div className="text-center font-bold text-slate-400 text-[10px] uppercase py-2">No File Attached</div>
                )}
                
                {service.status === 'Pending' && (
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => updateServiceStatus(service.id, 'Completed')} className="flex-1 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 py-1.5 rounded-lg transition font-bold"><CheckCircle2 size={16} className="mx-auto"/></button>
                    <button onClick={() => updateServiceStatus(service.id, 'Cancelled')} className="flex-1 bg-rose-100 text-rose-600 hover:bg-rose-200 py-1.5 rounded-lg transition font-bold"><XCircle size={16} className="mx-auto"/></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}