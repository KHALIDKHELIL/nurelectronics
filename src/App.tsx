import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchCatalog } from './services/api';
import type { Product } from './types/store';
import { AppProvider } from './context/AppContext';

// Layouts & Pages
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import LandingPage from './pages/public/LandingPage';
import Shop from './pages/public/Shop';
import ProductDetails from './pages/public/ProductDetails';
import Services from './pages/public/Services'; // New File
import WebCatalog from './pages/admin/WebCatalog';
import Orders from './pages/admin/Orders';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCatalog().then(setProducts).catch(console.error);
  }, []);

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage products={products} />} />
            <Route path="/shop" element={<Shop products={products} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/product/:id" element={<ProductDetails products={products} />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/catalog" replace />} />
            <Route path="catalog" element={<WebCatalog />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}