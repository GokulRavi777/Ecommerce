'use client';

import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, fetchProducts } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts(); // Refresh products to ensure fresh stock limits are loaded
  }, [fetchProducts]);

  if (!mounted) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading cart...</p>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col items-center justify-center space-y-6"
        >
          <div className="p-5 bg-violet-50 text-violet-600 rounded-full">
            <ShoppingCart className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Your Cart is Empty</h1>
            <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our creative tools and premium stationery items to get started!
            </p>
          </div>
          <Link href="/products">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-slate-900 hover:bg-violet-600 text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>Start Shopping</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {/* 🧭 Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">Shopping Cart</h1>
        <p className="text-slate-500 font-semibold mt-2 text-sm">Review your selected items before proceeding to checkout.</p>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* 🛒 Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 flex flex-col sm:flex-row gap-5 items-stretch sm:items-center"
              >
                {/* Item Image */}
                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100/50">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">No Img</div>
                  )}
                </div>
                
                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-widest text-violet-600 mb-1">{item.category}</span>
                  <Link href={`/products/${item.id}`} className="font-bold text-base sm:text-lg text-slate-900 hover:text-violet-600 transition-colors truncate">
                    {item.name}
                  </Link>
                  <p className="text-slate-800 font-black text-base mt-1">₹{item.price.toFixed(2)}</p>
                </div>

                {/* Item Actions (Quantity & Remove) */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t border-slate-50 sm:border-t-0">
                  <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-1">
                    <button 
                      onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-1.5 text-slate-500 hover:text-violet-600 transition-colors font-black text-xs cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-slate-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 text-slate-500 hover:text-violet-600 disabled:opacity-40 disabled:hover:text-slate-500 transition-colors font-black text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 📋 Order Summary panel sticky */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 h-fit sticky top-24 space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800 font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">Free Delivery</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between font-black text-xl text-slate-900">
                <span>Total Amount</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/checkout">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-slate-950 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-950/10 hover:shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center pt-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>SSL Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
