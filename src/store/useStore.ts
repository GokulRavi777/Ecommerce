import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { Order, OrderStatus } from '@/types/order';
import { 
  getProducts, 
  addProductAction, 
  updateProductAction, 
  deleteProductAction, 
  getOrders, 
  createOrderAction, 
  updateOrderStatusAction 
} from '@/app/actions/dbActions';

export interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  
  // Database Sync Actions
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  
  // Product Mutations
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Cart Actions (Persisted Locally)
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Order Actions
  addOrder: (order: Order) => Promise<{ success: boolean; error?: string }>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      orders: [],
      
      // Fetch products from database
      fetchProducts: async () => {
        try {
          const products = await getProducts();
          set({ products });
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      },

      // Fetch orders from database
      fetchOrders: async () => {
        try {
          const orders = await getOrders();
          set({ orders });
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      },
      
      // Add product to database & state
      addProduct: async (product) => {
        try {
          await addProductAction(product);
          set((state) => ({ products: [...state.products, product] }));
        } catch (error) {
          console.error('Failed to add product:', error);
          throw error;
        }
      },

      // Update product in database & state
      updateProduct: async (id, updatedFields) => {
        try {
          const updated = await updateProductAction(id, updatedFields);
          set((state) => ({
            products: state.products.map(p => p.id === id ? updated : p)
          }));
        } catch (error) {
          console.error('Failed to update product:', error);
          throw error;
        }
      },

      // Delete product from database & state
      deleteProduct: async (id) => {
        try {
          await deleteProductAction(id);
          set((state) => ({
            products: state.products.filter(p => p.id !== id)
          }));
        } catch (error) {
          console.error('Failed to delete product:', error);
          throw error;
        }
      },

      // Cart management (local state only)
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item => 
              item.id === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) } : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),

      updateCartQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      })),

      clearCart: () => set({ cart: [] }),

      // Add order through transactional checkout Server Action
      addOrder: async (order) => {
        try {
          const result = await createOrderAction(order);
          if (result.success) {
            // Update local state orders and refresh products
            const orders = await getOrders();
            const products = await getProducts();
            set({ orders, products });
            return { success: true };
          }
          return { success: false, error: result.error };
        } catch (error) {
          console.error('Failed to place order:', error);
          return { success: false, error: 'Failed to place order. Connection issue.' };
        }
      },

      // Update order status in database & state
      updateOrderStatus: async (id, status) => {
        try {
          const updated = await updateOrderStatusAction(id, status);
          set((state) => ({
            orders: state.orders.map(o => o.id === id ? updated : o)
          }));
        } catch (error) {
          console.error('Failed to update order status:', error);
          throw error;
        }
      },
    }),
    {
      name: 'ecommerce-storage',
      // ONLY persist the cart! Products and orders are database-driven.
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
