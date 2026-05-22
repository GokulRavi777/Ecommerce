'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreditCard, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Order } from '@/types/order';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart, addOrder, fetchProducts } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    setMounted(true);
    fetchProducts(); // Ensure we have the latest database stock levels
  }, [fetchProducts]);

  if (!mounted) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isProcessing) {
    router.push('/cart');
    return null;
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const order: Order = {
      id: `ORD-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      status: 'Pending',
      shippingDetails: shipping,
      paymentMethod: `**** **** **** ${payment.cardNumber.slice(-4) || '0000'}`
    };
    
    try {
      const res = await addOrder(order);
      if (res.success) {
        toast.success('Order placed successfully!');
        clearCart();
        router.push('/success');
      } else {
        setIsProcessing(false);
        toast.error(res.error || 'Checkout failed. Please check stock availability.', { duration: 5000 });
      }
    } catch (err) {
      setIsProcessing(false);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {/* 🧭 Back / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-violet-50 p-3 rounded-2xl text-violet-600 border border-violet-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Secure Checkout</h1>
            <p className="text-slate-500 font-semibold mt-1.5 text-xs">Verify your transaction and details safely.</p>
          </div>
        </div>
        <Link href="/cart" className="inline-flex items-center text-slate-500 hover:text-violet-600 font-bold transition-colors text-sm group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Cart
        </Link>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* 📝 Forms Column */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center tracking-tight">
                <Truck className="w-5 h-5 mr-3 text-violet-600 animate-pulse" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">First Name</label>
                  <input required type="text" value={shipping.firstName} onChange={e => setShipping({...shipping, firstName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Last Name</label>
                  <input required type="text" value={shipping.lastName} onChange={e => setShipping({...shipping, lastName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Street Address</label>
                  <input required type="text" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">City</label>
                  <input required type="text" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Zip Code</label>
                  <input required type="text" value={shipping.zipCode} onChange={e => setShipping({...shipping, zipCode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 space-y-6">
              <h2 className="text-xl font-black text-slate-900 flex items-center tracking-tight">
                <CreditCard className="w-5 h-5 mr-3 text-violet-600" /> Payment Details
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Card Number</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" maxLength={19} value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Expiry Date</label>
                    <input required type="text" placeholder="MM/YY" maxLength={5} value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CVC</label>
                    <input required type="text" placeholder="123" maxLength={4} value={payment.cvc} onChange={e => setPayment({...payment, cvc: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* 🛒 Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 sticky top-24 space-y-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Order Summary</h2>
            
            {/* Scrollable Items Preview */}
            <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 scrollbar-thin">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm font-semibold">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-11 h-11 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-100">
                      {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-slate-800 truncate">{item.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-slate-800 font-bold ml-2">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-6 border-t border-slate-100 text-sm font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800 font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">Free</span>
              </div>
              <div className="pt-4 flex justify-between font-black text-xl text-slate-900 border-t border-slate-50">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit checkout CTA */}
            <button 
              form="checkout-form"
              type="submit"
              disabled={isProcessing}
              className="w-full bg-slate-950 hover:bg-violet-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-950/10 hover:shadow-violet-600/20 flex justify-center items-center cursor-pointer"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Securing Order...</span>
                </div>
              ) : (
                `Pay ₹${total.toFixed(2)}`
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center pt-2">
              <ShieldCheck className="w-4.5 h-4.5 text-slate-400 animate-pulse" />
              <span>SSL Protected Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
