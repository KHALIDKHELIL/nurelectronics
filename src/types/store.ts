export type PaymentMethod = 'Telebirr' | 'CBE Birr' | 'Cash on Pickup';

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Product {
  id: string;
  pos_item_id?: string | null; // Maps to Firestore inventory doc_id later
  name: string;
  category: string;
  retail_price: number;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface OrderItemPayload {
  id: string;
  pos_item_id?: string | null;
  name: string;
  retail_price: number;
  qty: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  payment_method: PaymentMethod;
  payment_ref?: string;
  items: OrderItemPayload[];
  total_price: number;
  status: OrderStatus;
}