export type PaymentMethod = 'Telebirr' | 'CBE Birr' | 'Cash on Pickup';

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  name_am?: string;
  name_om?: string;
  category: string;
  retail_price: number;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  brand?: string;
  condition?: string;
  condition_am?: string;
  condition_om?: string;
  description?: string;
  description_am?: string;
  description_om?: string;
  specifications?: Record<string, string>;
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