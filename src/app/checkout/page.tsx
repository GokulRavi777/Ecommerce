'use client';

import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { Order } from '@/types/order';

export default function CheckoutPage() {
  const { cart, clearCart, addOrder } = useStore();
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
  }, []);

  if (!mounted) return null;

  if (cart.length === 0 && !isProcessing) {
    router.push('/cart');
    return null;
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const order: Order = {
        id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        date: new Date().toISOString(),
        items: [...cart],
        total,
        status: 'Pending',
        shippingDetails: shipping,
        paymentMethod: `**** **** **** ${payment.cardNumber.slice(-4) || '0000'}`
      };
      
      addOrder(order);
      clearCart();
      router.push('/success');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center space-x-3 mb-10">
        <div className="bg-violet-100 p-3 rounded-2xl text-violet-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
          <p className="text-slate-500 font-medium">Complete your order securely.</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-900">
                <Truck className="w-5 h-5 mr-3 text-violet-500" /> Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                  <input required type="text" value={shipping.firstName} onChange={e => setShipping({...shipping, firstName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                  <input required type="text" value={shipping.lastName} onChange={e => setShipping({...shipping, lastName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Street Address</label>
                  <input required type="text" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">City</label>
                  <input required type="text" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Zip Code</label>
                  <input required type="text" value={shipping.zipCode} onChange={e => setShipping({...shipping, zipCode: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-900">
                <CreditCard className="w-5 h-5 mr-3 text-violet-500" /> Payment Details
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Card Number</label>
                  <input required type="text" placeholder="0000 0000 0000 0000" maxLength={19} value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry Date</label>
                    <input required type="text" placeholder="MM/YY" maxLength={5} value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">CVC</label>
                    <input required type="text" placeholder="123" maxLength={4} value={payment.cvc} onChange={e => setPayment({...payment, cvc: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <div className="text-slate-900">{item.name}</div>
                      <div className="text-slate-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-slate-900 font-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">Free</span>
              </div>
              <div className="pt-4 flex justify-between font-black text-2xl text-slate-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={isProcessing}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-violet-600/30 mt-8 flex justify-center items-center"
            >
              {isProcessing ? (
                <span className="animate-pulse">Processing Payment...</span>
              ) : (
                `Pay ₹${total.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
