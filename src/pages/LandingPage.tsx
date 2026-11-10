import { useState } from 'react';
import { 
  Smartphone, Printer, FileText, Globe, CheckCircle2, 
  Info, ArrowRight, Camera, ShoppingBag, Store, 
  ShieldCheck, MapPin, Phone, Clock, Search, Headphones, PackageSearch
} from 'lucide-react';
import type { Product } from '../types/store';

interface LandingPageProps {
  products: Product[];
  onBrowseProducts: () => void;
}

export default function LandingPage({ products, onBrowseProducts }: LandingPageProps) {
  const [activeService, setActiveService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: 'Passport Registration',
      icon: <Globe className="text-blue-500" size={28} />,
      desc: 'Fast, error-free online passport application assistance.',
      requirements: ['Renewed Kebele ID or Birth Certificate', 'Recent 4x4 digital photograph', 'Old passport (if renewing)']
    },
    {
      id: 2,
      title: 'Court Letter Writing',
      icon: <FileText className="text-amber-500" size={28} />,
      desc: 'Professional Amharic & Afaan Oromoo legal letter formatting.',
      requirements: ['Names of all involved parties', 'Original evidence or previous court summons', 'Clear timeline of events']
    },
    {
      id: 3,
      title: 'DV Lottery Entry',
      icon: <Camera className="text-emerald-500" size={28} />,
      desc: 'Strictly formatted DV lottery applications with photo editing.',
      requirements: ['Passport or Kebele ID', 'We take your 600x600px photo here', 'Highest level of education details']
    },
    {
      id: 4,
      title: 'Custom Printing',
      icon: <Printer className="text-purple-500" size={28} />,
      desc: 'Business cards, wedding invitations, and flyers.',
      requirements: ['Bring your design on a flash drive OR', 'Sit with our designer to create one', '50% deposit for bulk']
    }
  ];

  return (
    <div className="animate-in fade-in duration-700 flex flex-col min-h-screen bg-slate-50 dark:bg-[#0a0a0a]">
      
      {/* 1. Croma-Style Massive Hero Carousel / Banner */}
      <section className="max-w-7xl mx-auto p-4 md:p-6 w-full mt-2">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black rounded-3xl overflow-hidden shadow-2xl relative border border-slate-800">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
          <div className="relative z-10 px-6 py-16 md:py-24 md:px-16 flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs tracking-widest uppercase mb-4 border border-indigo-500/30">
                Premium Tech in Bale Zone
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Your Digital Hub. <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Locally Sourced.</span>
              </h2>
              <p className="text-slate-300 mb-8 text-lg md:text-xl font-light">
                Reserve 100% genuine electronics, request custom orders, or access fast digital government services.
              </p>
              <button 
                onClick={onBrowseProducts}
                className="bg-white text-slate-900 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold flex items-center justify-center md:justify-start gap-2 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] w-full md:w-auto"
              >
                Shop Electronics <ArrowRight size={20} />
              </button>
            </div>
            
            {/* Sony-Style Product Showcase inside Hero */}
            <div className="hidden md:block relative w-72 h-72 mt-10 md:mt-0">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1605236453806-6ff36852f6c1?w=500&auto=format&fit=crop&q=80" 
                alt="Premium Audio" 
                className="relative z-10 w-full h-full object-cover rounded-full border-4 border-slate-800/50 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Croma-Style Quick Categories (Horizontal Scroll) */}
      <section className="max-w-7xl mx-auto px-4 w-full mt-6">
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {[
            { icon: <Smartphone size={24} />, name: "Smartphones", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
            { icon: <Headphones size={24} />, name: "Audio", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
            { icon: <PackageSearch size={24} />, name: "Special Order", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
            { icon: <Globe size={24} />, name: "Passports", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
            { icon: <Printer size={24} />, name: "Printing", color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" },
          ].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-3 snap-start min-w-[80px] cursor-pointer group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${cat.color}`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The New Feature: Custom Sourcing Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 w-full mt-8">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hidden sm:block">
              <Search size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold">Looking for something specific?</h3>
              <p className="text-amber-100 text-sm md:text-base mt-1">If we don't have it in stock, we will find it and order it for you.</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition shadow-sm whitespace-nowrap">
            Request an Item
          </button>
        </div>
      </section>

      {/* 4. Sony-Style Minimalist Tech Grid */}
      <section className="max-w-7xl mx-auto px-4 mt-16 w-full">
        <div className="flex justify-between items-end mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Trending Tech</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Reserve online, pickup in store.</p>
          </div>
          <button onClick={onBrowseProducts} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline hidden sm:flex items-center gap-1">
            View All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((item) => (
            <div key={item.id} className="bg-white dark:bg-[#111] rounded-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800">
              <div className="h-48 md:h-56 bg-slate-100 dark:bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center p-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition duration-700" />
                ) : (
                  <div className="text-slate-400 text-xs">No Image</div>
                )}
                {item.stock_quantity > 0 && item.stock_quantity <= 5 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider uppercase">
                    Only {item.stock_quantity} left
                  </span>
                )}
              </div>
              <div className="p-5">
                <h4 className="font-bold text-sm md:text-base line-clamp-2 text-slate-900 dark:text-white mb-2">{item.name}</h4>
                <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-lg md:text-xl">{item.retail_price.toLocaleString()} <span className="text-sm font-semibold">ETB</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Clean, Professional Services Accordion */}
      <section id="services-section" className="bg-white dark:bg-[#111] border-y border-slate-200 dark:border-slate-800 mt-20 py-16 w-full flex-grow">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Digital Services Guide</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              Skip the confusion. Click on any service below to see exactly what you need to bring to our shop for instant processing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                className={`bg-slate-50 dark:bg-black rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                  activeService === service.id 
                    ? 'border-indigo-500 dark:border-indigo-500 shadow-lg' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="p-6 flex gap-5 items-center">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{service.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-1">{service.desc}</p>
                  </div>
                  <Info className={`shrink-0 transition-transform duration-300 ${activeService === service.id ? 'rotate-180 text-indigo-500' : 'text-slate-300 dark:text-slate-600'}`} />
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

      {/* 6. Comprehensive Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-600 text-white p-2 rounded-xl">
                <Store size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white leading-tight">KioskMarket</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Bale Zone</p>
              </div>
            </div>
            <p className="text-sm max-w-sm mb-6 leading-relaxed">
              The premier destination for genuine electronics, professional digital services, and premium custom printing in the Bale Zone.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><button onClick={onBrowseProducts} className="hover:text-white transition">Electronics Catalog</button></li>
              <li><button className="hover:text-white transition">Request Custom Order</button></li>
              <li><button onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition">Digital Services Guide</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Visit Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>Bale Zone, Oromia<br/>(Main Street Center)</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-400 shrink-0" />
                <span>+251 911 000 000</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800/50 text-xs flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} KioskMarket ET. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1"><ShieldCheck size={14}/> Verified Local Business</span>
          </div>
        </div>
      </footer>
    </div>
  );
}