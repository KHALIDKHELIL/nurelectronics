import React, { useEffect, useState } from 'react';
import { fetchCatalog, submitOrder } from './services/api';
import type { Product, CartItem, PaymentMethod } from './types/store';
import { ShoppingBag, Search, CheckCircle2, X, Plus, Minus, Trash2 } from 'lucide-react';

interface CustomerFormState {
  name: string;
  phone: string;
  payment: PaymentMethod;
  ref: string;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const [customer, setCustomer] = useState<CustomerFormState>({
    name: '',
    phone: '',
    payment: 'Telebirr',
    ref: '',
  });

  useEffect(() => {
    fetchCatalog()
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to load catalog:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock_quantity) return prev; // Enforce stock limit
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.qty + delta;
          if (nextQty > item.stock_quantity) return item;
          return { ...item, qty: nextQty };
        })
        .filter((item) => item.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.retail_price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart.length || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitOrder({
        customer_name: customer.name.trim(),
        customer_phone: customer.phone.trim(),
        payment_method: customer.payment,
        payment_ref: customer.ref.trim() || undefined,
        items: cart.map(({ id, pos_item_id, name, retail_price, qty }) => ({
          id,
          pos_item_id,
          name,
          retail_price,
          qty,
        })),
        total_price: cartTotal,
        status: 'pending',
      });

      setCart([]);
      setOrderSuccess(true);
      setCustomer({ name: '', phone: '', payment: 'Telebirr', ref: '' });
    } catch (error) {
      alert('Could not submit order. Please check your connection and try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-indigo-600">KioskMarket ET</h1>
            <p className="text-xs text-slate-500">Live Inventory & Instant Order Pickup</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-full text-sm font-medium transition shadow-sm"
          >
            <ShoppingBag size={18} />
            <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search phones, earbuds, chargers..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading live inventory...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {filteredProducts.map((item) => {
              const outOfStock = item.stock_quantity <= 0;
              const lowStock = item.stock_quantity > 0 && item.stock_quantity <= 5;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <div className="relative h-44 bg-slate-100">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No Image
                        </div>
                      )}
                      {lowStock && (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          🔥 Only {item.stock_quantity} left!
                        </span>
                      )}
                      {outOfStock && (
                        <span className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-bold text-sm">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs text-slate-400 font-medium">{item.category}</p>
                      <h3 className="font-semibold text-sm line-clamp-2 mt-0.5">{item.name}</h3>
                      <p className="text-indigo-600 font-bold text-base mt-2">
                        {item.retail_price.toLocaleString()} ETB
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 pt-0">
                    <button
                      disabled={outOfStock}
                      onClick={() => addToCart(item)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 transition"
                    >
                      {outOfStock ? 'Unavailable' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Slide-over Cart & Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-lg font-bold">Your Shopping Bag</h2>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setOrderSuccess(false);
                  }}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X size={22} />
                </button>
              </div>

              {orderSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 size={52} className="text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold">Order Received!</h3>
                  <p className="text-sm text-slate-600">
                    Our shop team has received your order and will call you shortly to confirm pickup or delivery.
                  </p>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  Your cart is currently empty.
                </div>
              ) : (
                <>
                  <div className="divide-y my-4">
                    {cart.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                        <div className="pr-2">
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {item.retail_price.toLocaleString()} ETB each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 rounded-md border hover:bg-slate-100"
                          >
                            {item.qty === 1 ? <Trash2 size={14} className="text-red-500" /> : <Minus size={14} />}
                          </button>
                          <span className="w-6 text-center font-semibold">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            disabled={item.qty >= item.stock_quantity}
                            className="p-1 rounded-md border hover:bg-slate-100 disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-3 mt-6 border-t pt-4">
                    <input
                      required
                      placeholder="Your Full Name"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-sm"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number (e.g., 0911...)"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full p-2.5 border rounded-xl text-sm"
                    />
                    <select
                      value={customer.payment}
                      onChange={(e) =>
                        setCustomer({ ...customer, payment: e.target.value as PaymentMethod })
                      }
                      className="w-full p-2.5 border rounded-xl text-sm bg-white"
                    >
                      <option value="Telebirr">Pay via Telebirr</option>
                      <option value="CBE Birr">Pay via CBE Birr</option>
                      <option value="Cash on Pickup">Reserve & Pay at Shop</option>
                    </select>

                    {customer.payment !== 'Cash on Pickup' && (
                      <input
                        placeholder="Transaction Ref / Receipt No. (Optional)"
                        value={customer.ref}
                        onChange={(e) => setCustomer({ ...customer, ref: e.target.value })}
                        className="w-full p-2.5 border rounded-xl text-sm"
                      />
                    )}

                    <div className="pt-3 flex justify-between font-bold text-base border-t">
                      <span>Total:</span>
                      <span className="text-indigo-600">{cartTotal.toLocaleString()} ETB</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}