import { useState } from 'react';
import { Globe, FileText, Camera, Printer, UploadCloud, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../services/api';

export default function Services() {
  const [activeService, setActiveService] = useState<string>('Passport Registration');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const services = [
    { title: 'Passport Registration', icon: <Globe size={24} />, reqs: 'Upload Kebele ID / Old Passport' },
    { title: 'Court Letter Writing', icon: <FileText size={24} />, reqs: 'Upload Evidence Documents' },
    { title: 'DV Lottery Entry', icon: <Camera size={24} />, reqs: 'Upload 600x600 Photo & ID' },
    { title: 'Custom Printing', icon: <Printer size={24} />, reqs: 'Upload Design File (PDF/Image)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return alert("Name and Phone are required");
    setIsSubmitting(true);

    try {
      let fileUrl = null;
      if (file) {
        const ext = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('service-files').upload(fileName, file);
        if (uploadError) throw uploadError;
        fileUrl = supabase.storage.from('service-files').getPublicUrl(fileName).data.publicUrl;
      }

      const { error } = await supabase.from('service_requests').insert([{
        service_type: activeService, customer_name: name, customer_phone: phone, file_url: fileUrl, notes
      }]);

      if (error) throw error;
      setSuccess(true);
      setName(''); setPhone(''); setNotes(''); setFile(null);
    } catch (err: any) {
      alert("Submission failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-in zoom-in duration-500">
        <CheckCircle2 size={80} className="text-emerald-500 mb-6" />
        <h2 className="text-4xl font-black mb-2">Request Received!</h2>
        <p className="text-slate-500 mb-8 max-w-sm">We have received your {activeService} documents. We will review them and call you shortly.</p>
        <button onClick={() => setSuccess(false)} className="text-indigo-600 font-bold hover:underline">Submit another request</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-in fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Digital Services</h1>
        <p className="text-slate-500 max-w-xl mx-auto">Upload your documents remotely. We process everything professionally and securely.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">1. Select a Service</h3>
          {services.map(s => (
            <div 
              key={s.title} onClick={() => setActiveService(s.title)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${activeService === s.title ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111]'}`}
            >
              <div className={`p-3 rounded-xl ${activeService === s.title ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s.icon}</div>
              <div>
                <h4 className="font-bold text-lg">{s.title}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">{s.reqs}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl h-fit">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6">2. Upload & Submit</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-4 outline-none" required />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-4 outline-none" required />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions?" className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-xl p-4 outline-none min-h-[100px]" />
            
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 dark:bg-black relative">
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <UploadCloud size={32} className="text-indigo-500 mb-2" />
              <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{file ? file.name : 'Tap to upload required document'}</span>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white font-black py-4 rounded-xl shadow-lg transition mt-4">
              {isSubmitting ? 'Uploading securely...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}