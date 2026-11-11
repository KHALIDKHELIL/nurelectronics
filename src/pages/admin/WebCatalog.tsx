import { useState, useEffect } from 'react';
import { 
  Upload, Languages, CheckCircle2, Tag, List, PlusCircle, 
  Trash2, Camera, Image as ImageIcon, Edit, X, Plus, Minus
} from 'lucide-react';
import { supabase } from '../../services/api';

export default function WebCatalog() {
  const [webSubTab, setWebSubTab] = useState<'upload' | 'list'>('upload');
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Core Data
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Smartphones & Tech'); // Digital Services removed
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('active');
  
  // Extended Data
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('Brand New');
  const [description, setDescription] = useState('');
  
  // DYNAMIC SPECS STATE
  const [dynamicSpecs, setDynamicSpecs] = useState<{key: string, value: string}[]>([]);

  // TRANSLATION STATE (Massive Upgrade)
  const [nameAm, setNameAm] = useState('');
  const [nameOm, setNameOm] = useState('');
  const [descAm, setDescAm] = useState('');
  const [descOm, setDescOm] = useState('');
  const [condAm, setCondAm] = useState('');
  const [condOm, setCondOm] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // UI State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Note: Digital Services removed. They should be handled on a separate page.
  const categories = ['Smartphones & Tech', 'TVs & Receivers', 'Home Appliances', 'Lighting & Electrical', 'Accessories'];

  const fetchLiveProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLiveProducts(data || []);
    } catch (err: any) {
      console.error("Error fetching:", err.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (webSubTab === 'list') fetchLiveProducts();
  }, [webSubTab]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // FULL TRANSLATION ENGINE MOCK
  const handleAutoTranslate = () => {
    if (!name) return;
    setIsTranslating(true);
    
    setTimeout(() => {
      // 1. Translate Name
      let nAm = `${name}`, nOm = `${name}`;
      const lowerName = name.toLowerCase();
      if (lowerName.includes('phone')) { nAm = 'ስልክ'; nOm = 'Bilbila'; }
      if (lowerName.includes('tv')) { nAm = 'ቴሌቪዥን'; nOm = 'Televiziyinii'; }
      if (lowerName.includes('fridge')) { nAm = 'ፍሪጅ'; nOm = 'Firijii'; }
      setNameAm(nAm); setNameOm(nOm);

      // 2. Translate Condition
      let cAm = condition, cOm = condition;
      if (condition === 'Brand New') { cAm = 'አዲስ'; cOm = 'Haaraa'; }
      if (condition === 'Used') { cAm = 'ያገለገለ'; cOm = 'Kan Tajaajile'; }
      setCondAm(cAm); setCondOm(cOm);

      // 3. Translate Description (Mocking a full sentence translation)
      if (description) {
        setDescAm(`(Amharic) ${description}`);
        setDescOm(`(Oromoo) ${description}`);
      }

      setIsTranslating(false);
    }, 1200);
  };

  const addSpecRow = () => setDynamicSpecs([...dynamicSpecs, { key: '', value: '' }]);
  const removeSpecRow = (index: number) => setDynamicSpecs(dynamicSpecs.filter((_, i) => i !== index));
  const updateSpecRow = (index: number, field: 'key'|'value', val: string) => {
    const newSpecs = [...dynamicSpecs];
    newSpecs[index][field] = val;
    setDynamicSpecs(newSpecs);
  };

  const handleUpload = async () => {
    if (!name || !price || !stock) return;
    setIsUploading(true);

    try {
      let finalImageUrl = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }

      const specsJson = dynamicSpecs.reduce((acc: any, curr) => {
        if (curr.key.trim() && curr.value.trim()) acc[curr.key.trim()] = curr.value.trim();
        return acc;
      }, {});

      const { error: dbError } = await supabase.from('products').insert([{
        name, name_am: nameAm, name_om: nameOm, 
        category, retail_price: parseFloat(price), stock_quantity: parseInt(stock, 10), 
        image_url: finalImageUrl, is_active: true,
        brand, 
        condition, condition_am: condAm, condition_om: condOm,
        description, description_am: descAm, description_om: descOm,
        specifications: specsJson
      }]);

      if (dbError) throw dbError;
      
      setSuccessMsg('Product successfully published!');
      
      // Reset Form completely
      setName(''); setNameAm(''); setNameOm(''); setPrice(''); setStock(''); 
      setBrand(''); setCondition('Brand New'); setCondAm(''); setCondOm('');
      setDescription(''); setDescAm(''); setDescOm(''); setDynamicSpecs([]);
      setImageFile(null); setImagePreview(null);
      
      fetchLiveProducts();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop();
      if (fileName) supabase.storage.from('product-images').remove([fileName]);
    }
    await supabase.from('products').delete().eq('id', id);
    setLiveProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateSubmit = async () => {
    if (!editingProduct) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase.from('products').update({
        name: editingProduct.name,
        category: editingProduct.category,
        retail_price: parseFloat(editingProduct.retail_price),
        stock_quantity: parseInt(editingProduct.stock_quantity, 10),
        brand: editingProduct.brand,
        condition: editingProduct.condition,
        description: editingProduct.description
      }).eq('id', editingProduct.id);
      
      if (error) throw error;
      setLiveProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in relative">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold">Catalog Manager</h2>
          <p className="text-slate-500 mt-2">Manage physical inventory for the storefront.</p>
        </div>
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setWebSubTab('upload')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${webSubTab === 'upload' ? 'bg-white dark:bg-[#111] text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <PlusCircle size={16} /> Upload New
          </button>
          <button onClick={() => setWebSubTab('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${webSubTab === 'list' ? 'bg-white dark:bg-[#111] text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <List size={16} /> View Products
          </button>
        </div>
      </div>

      {/* TAB 1: UPLOAD FORM */}
      {webSubTab === 'upload' && (
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column: Form Inputs */}
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">1. Core Information</h3>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HP Pavilion 15 Core i7" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price (ETB)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Brand (Optional)</label>
                  <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. HP" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Condition</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none">
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Used">Used / Refurbished</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Stock Qty</label>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="10" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none">
                    <option value="active">Regular</option><option value="discount">Discounted</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">2. Technical Grid (Optional)</h3>
                <p className="text-xs text-slate-500 mt-1">Add specific features like RAM, Storage, Color, Wattage.</p>
              </div>
              
              {dynamicSpecs.map((spec, i) => (
                <div key={i} className="flex gap-2 items-center mb-3">
                  <input placeholder="Label (e.g. RAM)" value={spec.key} onChange={(e) => updateSpecRow(i, 'key', e.target.value)} className="w-1/2 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm outline-none font-bold" />
                  <input placeholder="Value (e.g. 16GB)" value={spec.value} onChange={(e) => updateSpecRow(i, 'value', e.target.value)} className="w-1/2 bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm outline-none" />
                  <button onClick={() => removeSpecRow(i)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition"><Minus size={18}/></button>
                </div>
              ))}
              
              <button onClick={addSpecRow} className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg hover:bg-indigo-100 transition">
                <Plus size={16} /> Add Grid Feature
              </button>
            </div>
            
            <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">3. Media & Description</h3>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">General Paragraph</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Type a general description sentence..." className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none min-h-[100px]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Photo</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl h-40 flex flex-col items-center justify-center bg-slate-50 dark:bg-black hover:bg-slate-100 dark:hover:bg-slate-900 transition overflow-hidden group">
                  <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-contain p-2" />
                  ) : (
                    <>
                      <Camera size={32} className="text-slate-400 mb-2 group-hover:text-indigo-500 transition" />
                      <span className="text-sm font-bold text-slate-500">Tap to upload</span>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Advanced Translation & Publishing */}
          <div className="space-y-6">
            
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg border border-indigo-800/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><Languages size={22}/> Complete Localization</h3>
              </div>
              
              <div className="space-y-6">
                {/* Name Translation */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider border-b border-indigo-700/50 pb-1">Product Name</p>
                  <input value={nameAm} onChange={(e) => setNameAm(e.target.value)} placeholder="Amharic Name" className="w-full bg-black/40 border border-indigo-700/50 rounded-xl p-3 outline-none text-sm" />
                  <input value={nameOm} onChange={(e) => setNameOm(e.target.value)} placeholder="Oromoo Name" className="w-full bg-black/40 border border-indigo-700/50 rounded-xl p-3 outline-none text-sm" />
                </div>

                {/* Condition Translation */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider border-b border-indigo-700/50 pb-1">Condition ({condition})</p>
                  <div className="flex gap-2">
                    <input value={condAm} onChange={(e) => setCondAm(e.target.value)} placeholder="Amharic" className="w-1/2 bg-black/40 border border-indigo-700/50 rounded-xl p-3 outline-none text-sm" />
                    <input value={condOm} onChange={(e) => setCondOm(e.target.value)} placeholder="Oromoo" className="w-1/2 bg-black/40 border border-indigo-700/50 rounded-xl p-3 outline-none text-sm" />
                  </div>
                </div>

                {/* Description Translation */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider border-b border-indigo-700/50 pb-1">Description</p>
                  <textarea value={descAm} onChange={(e) => setDescAm(e.target.value)} placeholder="Amharic Description" className="w-full bg-black/40 border border-indigo-700/50 rounded-xl p-3 outline-none text-sm min-h-[60px]" />
                  <textarea value={descOm} onChange={(e) => setDescOm(e.target.value)} placeholder="Oromoo Description" className="w-full bg-black/40 border border-indigo-700/50 rounded-xl p-3 outline-none text-sm min-h-[60px]" />
                </div>
              </div>

              <button onClick={handleAutoTranslate} disabled={!name || isTranslating} className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition mt-8 flex items-center justify-center gap-2">
                {isTranslating ? 'Running Translation Engine...' : '✨ Auto-Translate All Fields'}
              </button>
            </div>
            
            {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 font-bold"><CheckCircle2 size={20} /> {successMsg}</div>}
            
            <button onClick={handleUpload} disabled={isUploading || !name || !price || !stock} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black py-5 rounded-2xl shadow-xl transition flex justify-center gap-2 text-lg">
              <Upload size={24} /> {isUploading ? 'Saving Data...' : 'Publish to Store'}
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: LIST VIEW (RESTORED) */}
      {webSubTab === 'list' && (
        <div className="bg-white dark:bg-[#111] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          {isLoadingProducts ? (
            <div className="p-20 text-center text-slate-500 font-bold animate-pulse">Loading live inventory...</div>
          ) : liveProducts.length === 0 ? (
            <div className="p-20 text-center text-slate-500">No products uploaded yet.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500">
                  <th className="p-4 font-bold">Product</th>
                  <th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold text-right">Price</th>
                  <th className="p-4 font-bold text-right">Stock</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {liveProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#161616] transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover"/> : <ImageIcon size={18} className="text-slate-400"/>}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</span>
                        <span className="text-xs font-bold text-slate-400 block mt-0.5">{p.brand || 'Unbranded'} • {p.condition}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-400">{p.category}</td>
                    <td className="p-4 text-right font-black text-indigo-600 dark:text-indigo-400">{p.retail_price.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-slate-700 dark:text-slate-300">
                      {p.stock_quantity <= 5 ? <span className="text-rose-500">{p.stock_quantity}</span> : p.stock_quantity}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setEditingProduct(p)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition" title="Quick Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.image_url)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111] p-6 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black">Quick Edit: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Product Name</label>
                <input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Price (ETB)</label>
                  <input type="number" value={editingProduct.retail_price} onChange={(e) => setEditingProduct({...editingProduct, retail_price: e.target.value})} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 text-slate-500 uppercase">Stock Qty</label>
                  <input type="number" value={editingProduct.stock_quantity} onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: e.target.value})} className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-3 outline-none" />
                </div>
              </div>
            </div>

            <button onClick={handleUpdateSubmit} disabled={isUpdating} className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl shadow-lg transition disabled:opacity-50">
              {isUpdating ? 'Saving Changes...' : 'Save Quick Edits'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}