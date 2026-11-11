import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCatalog } from './services/api';
import type { Product } from './types/store';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import LandingPage from './pages/public/LandingPage';
import WebCatalog from './pages/admin/WebCatalog';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCatalog().then(setProducts).catch(console.error);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage products={products} onBrowseProducts={() => {}} />} />
          <Route path="/shop" element={<div className="p-10 text-center">Full Shop Grid goes here</div>} />
        </Route>

        {/* SECURE ADMIN DASHBOARD */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/catalog" replace />} />
          <Route path="catalog" element={<WebCatalog />} />
          <Route path="orders" element={<div className="p-10">Order Management coming soon...</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}