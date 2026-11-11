import { useState, useEffect } from 'react';
import { 
  Upload, Languages, Store, CheckCircle2, 
  Tag, List, PlusCircle, Trash2, Camera, Image as ImageIcon
} from 'lucide-react';
import { supabase } from '../../services/api';

export default function WebCatalog() {
  const [webSubTab, setWebSubTab] = useState<'upload' | 'list'>('upload');
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Upload Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Smartphones & Tech');
  const [status, setStatus] = useState('active');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  
  // NEW: Image File State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationPayload, setTranslationPayload] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = ['Smartphones & Tech', 'TVs & Receivers', 'Home Appliances', 'Lighting & Electrical', 'Digital Services'];

  const fetchLiveProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setLiveProducts(data || []);
    } catch (err: any) {
      console.error("Error fetching products:", err.message);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (webSubTab === 'list') fetchLiveProducts();
  }, [webSubTab]);

  // Handle local image selection (Phone Camera or PC Folder)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show local preview instantly
    }
  };

  const handleAutoTranslate = () => {
    if (!name) return;
    setIsTranslating(true);
    setTimeout(() => {
      const lower = name.toLowerCase();
      let am = `(Amharic) ${name}`, om = `(Afaan Oromoo) ${name}`;
      if (lower.includes('phone')) { am = 'ስልክ'; om = 'Bilbila'; }
      if (lower.includes('tv')) { am = 'ቴሌቪዥን'; om = 'Televiziyinii'; }
      if (lower.includes('fridge')) { am = 'ፍሪጅ'; om = 'Firijii'; }
      
      setTranslationPayload({ base_en: name, auto_am: am, auto_om: om, status: "approved_by_admin" });
      setIsTranslating(false);
    }, 1000);
  };

  const handleUpload = async () => {
    if (!name || !price || !stock) return;
    setIsUploading(true);

    try {
      let finalImageUrl = null;

      // 1. Upload Image to Supabase Storage (if selected)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        // Get the public URL to save in the database
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrl;
      }

      // 2. Save Product to Database
      const { error: dbError } = await supabase.from('products').insert([{
        name: name,
        category: category,
        retail_price: parseFloat(price),
        stock_quantity: parseInt(stock, 10),
        image_url: finalImageUrl,
        is_active: true
      }]);

      if (dbError) throw dbError;
      
      setSuccessMsg('Product successfully published to the website!');
      setName(''); setPrice(''); setStock(''); setImageFile(null); setImagePreview(null); setTranslationPayload(null);
      fetchLiveProducts();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if(!window.confirm("Are you sure you want to delete this item?")) return;
    
    // Optional: Delete the image from storage to save free space
    if (imageUrl) {
      const fileName = imageUrl.split('/').pop();
      if (fileName) supabase.storage.from('product-images').remove([fileName]);
    }

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setLiveProducts(prev => prev.filter(p => p.id !== id));
    else alert("Delete failed: " + error.message);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold">Catalog Manager</h2>
          <p className="text-slate-500 mt-2">Manage the public e-commerce storefront inventory.</p>
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

      {webSubTab === 'upload' && (
        <div className="grid md:grid-cols-2 gap-8">
          {successMsg && (
            <div className="md:col-span-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 font-bold">
              <CheckCircle2 size={20} /> {successMsg}
            </div>
          )}

          <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Name (English)</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Samsung 55-inch TV" className="w-full bg-slate-50 dark:bg-black border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-black border rounded-xl p-3 outline-none">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"><Tag size={14} className="inline mr-1"/> Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-slate-50 dark:bg-black border rounded-xl p-3 outline-none">
                  <option value="active">Regular</option><option value="discount">Discounted</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Retail Price</label>
                <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 dark:bg-black border rounded-xl p-3 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Stock</label>
                <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="10" className="w-full bg-slate-50 dark:bg-black border rounded-xl p-3 outline-none" />
              </div>
            </div>

            {/* NEW IMAGE UPLOADER */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Product Photo</label>
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl h-40 flex flex-col items-center justify-center bg-slate-50 dark:bg-black hover:bg-slate-100 dark:hover:bg-slate-900 transition overflow-hidden group">
                <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                  <>
                    <Camera size={32} className="text-slate-400 mb-2 group-hover:text-indigo-500 transition" />
                    <span className="text-sm font-bold text-slate-500">Tap to take photo</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg border border-indigo-800/50">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Languages size={20}/> Localization</h3>
              <button onClick={handleAutoTranslate} disabled={!name || isTranslating} className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition mt-4">
                {isTranslating ? 'Translating...' : '✨ Auto-Translate'}
              </button>
            </div>
            <button onClick={handleUpload} disabled={!translationPayload || isUploading} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl shadow-lg transition flex justify-center gap-2 text-lg">
              <Upload size={22} /> {isUploading ? 'Uploading Image & Saving...' : 'Publish to Website'}
            </button>
          </div>
        </div>
      )}

      {webSubTab === 'list' && (
        <div className="bg-white dark:bg-[#111] rounded-2xl border shadow-sm overflow-x-auto">
          {isLoadingProducts ? <div className="p-10 text-center">Loading...</div> : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-black border-b text-xs uppercase text-slate-500">
                  <th className="p-4 font-bold">Product</th><th className="p-4 font-bold">Category</th>
                  <th className="p-4 font-bold text-right">Price</th><th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {liveProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#161616]">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden">
                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover"/> : <ImageIcon size={16} className="text-slate-400"/>}
                      </div>
                      <span className="font-bold line-clamp-1">{p.name}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{p.category}</td>
                    <td className="p-4 text-right font-bold text-indigo-500">{p.retail_price} ETB</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(p.id, p.image_url)} className="p-2 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}