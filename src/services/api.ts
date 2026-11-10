import { createClient } from '@supabase/supabase-js';
import type { Product, OrderPayload } from '../types/store';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch active catalog with strict Product[] return type
export async function fetchCatalog(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Product[]) || [];
}

// Submit customer order
export async function submitOrder(orderPayload: OrderPayload): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .insert([orderPayload]);

  if (error) throw new Error(error.message);
}