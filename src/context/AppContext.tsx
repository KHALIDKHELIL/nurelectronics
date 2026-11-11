import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../types/store';

type Language = 'EN' | 'AM' | 'OM';
type CartItem = { product: Product; quantity: number };

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTrans: (product: Product, field: 'name' | 'condition' | 'description') => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        if (exists.quantity >= product.stock_quantity) {
          alert(`Only ${product.stock_quantity} available in stock.`);
          return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      if (product.stock_quantity <= 0) {
        alert("This item is out of stock.");
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.product.id !== id));

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item; // Can't go below 1 (use the trash can instead)
        if (newQty > item.product.stock_quantity) {
          alert(`Cannot exceed available stock (${item.product.stock_quantity}).`);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const getTrans = (product: Product, field: 'name' | 'condition' | 'description') => {
    if (language === 'EN') return product[field] || '';
    const localizedKey = `${field}_${language.toLowerCase()}` as keyof Product;
    return (product[localizedKey] as string) || product[field] || '';
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, cart, addToCart, removeFromCart, updateQuantity, clearCart, getTrans }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};