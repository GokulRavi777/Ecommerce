'use client';

import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/product/ProductGrid';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const products = useStore((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-screen flex items-center justify-center text-slate-400 font-medium">Loading amazing things...</div>;

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-20 pb-20">
      <section className="relative pt-20 pb-32 overflow-hidden rounded-[3rem] mt-6 bg-slate-900 shadow-2xl mx-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/90 via-fuchsia-600/80 to-orange-500/80 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-white/90 text-sm font-semibold mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Back to school season is here</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight leading-[1.1]">
              Elevate Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-rose-300">
                Learning Experience
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mb-12 font-medium leading-relaxed">
              Discover our curated collection of premium stationery, crafted to inspire creativity and boost your productivity.
            </p>

            <Link href="/products">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-violet-900 px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all flex items-center space-x-3 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Featured Essentials</h2>
            <p className="text-slate-500 mt-2 text-lg">Handpicked tools for the modern student.</p>
          </div>
          <Link href="/products" className="text-violet-600 font-bold hover:text-violet-700 flex items-center group">
            View all products <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
}
