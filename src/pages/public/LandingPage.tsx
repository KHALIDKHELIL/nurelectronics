import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, Printer, FileText, Globe, CheckCircle2, 
  Info, ArrowRight, Camera, Store, MapPin, Phone, 
  Search, Tv, Zap, Clock, ShieldCheck
} from 'lucide-react';
import type { Product } from '../../types/store'; 

interface LandingPageProps {
  products: Product[];
}

export default function LandingPage({ products = [] }: LandingPageProps) {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState<number | null>(null);

  // --- DYNAMIC DATA GROUPING ---
  const phonesAndTech = products.filter(p => p.category === 'Smartphones & Tech');
  const homeAppliances = products.filter(p => p.category === 'Home Appliances' || p.category === 'TVs & Receivers');
  const flashDeals = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5);

  const services = [
    { id: 1, title: 'Passport Registration', icon: <Globe className="text-blue-500" size={28} />, desc: 'Fast, error-free online passport application assistance.', requirements: ['Renewed Kebele ID or Birth Certificate', 'Recent 4x4 digital photograph', 'Old passport (if renewing)'] },
    { id: 2, title: 'Court Letter Writing', icon: <FileText className="text-amber-500" size={28} />, desc: 'Professional Amharic & Afaan Oromoo legal letter formatting.', requirements: ['Names of all involved parties', 'Original evidence or previous court summons', 'Clear timeline of events'] },
    { id: 3, title: 'DV Lottery Entry', icon: <Camera className="text-emerald-500" size={28} />, desc: 'Strictly formatted DV lottery applications with photo editing.', requirements: ['Passport or Kebele ID', 'We take your 600x600px photo here', 'Highest level of education details'] },
    { id: 4, title: 'Custom Printing', icon: <Printer className="text-purple-500" size={28} />, desc: 'Business cards, wedding invitations, and flyers.', requirements: ['Bring your design on a flash drive OR', 'Sit with our designer to create one', '50% deposit for bulk'] }
  ];

  // Reusable Component: Navigates to the Details Page when clicked
  const ProductCard = ({ item }: { item: any }) => (
    <div 
      onClick={() => navigate(`/product/${item.id}`)}
      className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 flex flex-col h-full min-w-[160px] md:min-w-[220px] snap-start cursor-pointer"
    >
      <div className="h-40 md:h-48 bg-slate-50 dark:bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center p-4">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition duration-700" />
        ) : (
          <Store size={40} className="text-slate-300 dark:text-slate-700" />
        )}
        {item.stock_quantity > 0 && item.stock_quantity <= 5 && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg animate-pulse">
            Only {item.stock_quantity} left
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-sm md:text-base line-clamp-2 text-slate-900 dark:text-white mb-1">{item.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{item.category}</p>
        <div className="mt-auto">
          <p className="text-indigo-600 dark:text-indigo-400 font-black text-lg md:text-xl">{item.retail_price.toLocaleString()} <span className="text-xs font-bold">ETB</span></p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 flex flex-col min-h-screen">
      
      {/* 1. HERO BANNER */}
      <section className="max-w-7xl mx-auto p-4 md:p-6 w-full mt-2">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black rounded-3xl overflow-hidden shadow-2xl relative border border-slate-800">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601524909162-ae8725290836?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
          <div className="relative z-10 px-6 py-12 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs tracking-widest uppercase mb-4 border border-indigo-500/30">
                Premium Tech & Home Hub
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Everything for your home. <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Reserved instantly.</span>
              </h2>
              <p className="text-slate-300 mb-8 text-base md:text-lg font-light">
                From smartphones and 4K TVs to microwaves and digital government services. Genuine stock right here in Bale Zone.
              </p>
              <button 
                onClick={() => navigate('/shop')} 
                className="bg-white text-slate-900 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold flex items-center justify-center md:justify-start gap-2 transition-all transform hover:scale-105 shadow-xl w-full md:w-auto"
              >
                View Full Catalog <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 w-full mt-8">
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {[
            { icon: <Smartphone size={24} />, name: "Phones", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
            { icon: <Tv size={24} />, name: "TVs & Audio", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
            { icon: <Zap size={24} />, name: "Appliances", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
            { icon: <Globe size={24} />, name: "Gov Services", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
            { icon: <Printer size={24} />, name: "Printing", color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" },
          ].map((cat, i) => (
            <div key={i} onClick={() => navigate('/shop')} className="flex flex-col items-center gap-3 snap-start min-w-[80px] cursor-pointer group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FLASH DEALS */}
      {flashDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12 w-full">
          <div className="flex items-center gap-3 mb-6 border-b border-rose-200 dark:border-rose-900/30 pb-4">
            <div className="bg-rose-100 dark:bg-rose-500/20 p-2 rounded-lg text-rose-600 dark:text-rose-400">
              <Zap size={24} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Selling Fast</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Almost out of stock. Reserve these now.</p>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x scrollbar-hide">
            {flashDeals.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {/* 4. SMARTPHONES & TECH */}
      {phonesAndTech.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12 w-full">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Phones & Tech</h3>
              <p className="text-slate-500 text-sm mt-1">100% genuine guaranteed.</p>
            </div>
            <button onClick={() => navigate('/shop')} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline hidden sm:flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x scrollbar-hide">
            {phonesAndTech.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {/* 5. CUSTOM SOURCING BANNER */}
      <section className="max-w-7xl mx-auto px-4 w-full mt-10">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hidden sm:block">
              <Search size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold">Looking for a specific item?</h3>
              <p className="text-amber-100 text-sm md:text-base mt-1">If it is not on the website, we can order it specially for you.</p>
            </div>
          </div>
          <button onClick={() => window.open('https://wa.me/251911000000?text=Hello%20KioskMarket,%20I%20want%20to%20request%20a%20special%20item.', '_blank')} className="w-full md:w-auto bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition shadow-sm whitespace-nowrap">
            Request an Item
          </button>
        </div>
      </section>

      {/* 6. HOME APPLIANCES */}
      {homeAppliances.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-16 w-full">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Home & Living</h3>
              <p className="text-slate-500 text-sm mt-1">Upgrade your space.</p>
            </div>
            <button onClick={() => navigate('/shop')} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline hidden sm:flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x scrollbar-hide">
            {homeAppliances.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {/* 7. DIGITAL SERVICES ACCORDION */}
      <section id="services-section" className="bg-white dark:bg-[#111] border-y border-slate-200 dark:border-slate-800 mt-20 py-16 w-full">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Digital Services</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Click on a service below to see exactly what documents you need to bring to our shop for instant processing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                className={`bg-slate-50 dark:bg-black rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                  activeService === service.id 
                    ? 'border-indigo-500 shadow-lg' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-6 flex gap-5 items-center">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{service.title}</h4>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">{service.desc}</p>
                  </div>
                  <Info className={`shrink-0 transition-transform duration-300 ${activeService === service.id ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
                </div>

                <div className={`bg-white dark:bg-[#0a0a0a] px-6 transition-all duration-300 ease-in-out ${
                  activeService === service.id ? 'max-h-96 py-6 border-t border-slate-100 dark:border-slate-800' : 'max-h-0 py-0 opacity-0'
                }`}>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Required Documents:</h5>
                  <ul className="space-y-3">
                    {service.requirements.map((req, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 items-start">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}