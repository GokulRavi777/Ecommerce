'use client';

import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/product/ProductGrid';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Award, Heart } from 'lucide-react';

export default function Home() {
  const { products, fetchProducts } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]);

  if (!mounted) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Loading amazing things...</p>
        </div>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-24 pb-24">
      {/* 🚀 Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden rounded-[2.5rem] mt-4 bg-slate-950 shadow-2xl mx-1 border border-slate-900">
        {/* Immersive Backgrounds */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/90 via-fuchsia-950/80 to-slate-950/95 backdrop-blur-[2px]"></div>
        
        {/* Animated ambient glowing blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="relative z-10 container mx-auto px-8 md:px-12 py-16 text-center md:text-left">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="md:col-span-7 flex flex-col items-center md:items-start space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full text-violet-300 text-xs font-black uppercase tracking-widest border border-white/10 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
                <span>Premium School Stationery</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] max-w-2xl">
                Inspire Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-pink-300">
                  Creative Mind
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed font-medium">
                Discover a carefully curated collection of premium tools designed to bring joy, organization, and effortless styling to your school work and daily projects.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/products">
                  <motion.button 
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-10 py-5 rounded-2xl font-black text-base shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.5)] transition-all flex items-center justify-center space-x-3 group border border-violet-400/20"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="md:col-span-5 hidden md:block"
            >
              <div className="relative aspect-square max-w-[420px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-[2.5rem] rotate-6 opacity-20 blur-lg animate-pulse"></div>
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-md p-3">
                  <img 
                    src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1974&auto=format&fit=crop" 
                    alt="Premium journal" 
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🛡️ Why Choose Us Section */}
      <section className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Truck, title: "Free Shipping", desc: "No minimum purchase limits. Free delivery nationwide." },
          { icon: ShieldCheck, title: "Secure Checkout", desc: "100% encrypted, secure billing and payment pathways." },
          { icon: Award, title: "Premium Quality", desc: "Sourced from top-tier artisan stationery manufacturers." },
          { icon: Heart, title: "Eco Friendly", desc: "Vegan leather and acid-free, sustainably sourced paper." },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-start space-x-4 hover:shadow-[0_15px_40px_rgb(0,0,0,0.05)] transition-all group"
          >
            <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base tracking-tight mb-1">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ✨ Featured Essentials Grid */}
      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-violet-600 font-bold uppercase tracking-widest text-xs mb-2">
              <span className="w-1.5 h-1.5 bg-violet-600 rounded-full"></span>
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">Featured Essentials</h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base font-semibold">Handpicked tools built to unlock your absolute best productivity.</p>
          </div>
          
          <Link href="/products" className="text-violet-600 font-bold hover:text-violet-700 flex items-center group text-sm md:text-base">
            View all products 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
        
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
