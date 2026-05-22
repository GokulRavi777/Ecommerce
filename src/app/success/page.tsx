'use client';

import { motion } from 'framer-motion';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 max-w-lg w-full text-center space-y-8 relative overflow-hidden"
      >
        {/* Glow ambient background element */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

        {/* 🌟 Spring Animated Success Check */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
            className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-50 shadow-lg shadow-emerald-500/10"
          >
            <Check className="w-8 h-8 stroke-[3]" />
          </motion.div>
        </div>
        
        {/* 🎉 Content Headers */}
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Order Placed!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 font-semibold text-sm max-w-sm mx-auto leading-relaxed"
          >
            Thank you for your purchase! Your payment went through successfully, and we have registered your order.
          </motion.p>
        </div>

        {/* 📦 Order Details card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-left space-y-4"
        >
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Shipping Timeline</span>
            <span className="text-violet-600 font-black">Estimated</span>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-black text-slate-800 text-base">Standard Free Delivery</h3>
            <p className="text-slate-500 text-xs font-medium">Your package will arrive in 2 - 3 business days. A tracking link will be emailed shortly.</p>
          </div>
        </motion.div>
        
        {/* 🧭 Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 pt-2"
        >
          <Link href="/products" className="flex-1">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-950 hover:bg-violet-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl shadow-slate-950/10 hover:shadow-violet-600/30 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Back to Shop</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
