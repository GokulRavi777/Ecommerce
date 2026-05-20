import { CartItem } from '@/store/useStore';

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingDetails: ShippingDetails;
  paymentMethod: string;
}
