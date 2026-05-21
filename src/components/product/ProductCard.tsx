'use client';

import { Product } from '@/types/product';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all border border-slate-100 flex flex-col h-full group"
    >
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
        <div className="aspect-[4/5] bg-slate-100/80 rounded-2xl mb-6 overflow-hidden relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-gradient-to-br from-slate-100 to-slate-200">
              No Image
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20">
                Only {product.stock} left
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/20">
                Sold Out
              </span>
            )}
          </div>
        </div>
        
        <div className="px-2 flex-1 flex flex-col">
          <span className="text-violet-500 text-xs font-bold uppercase tracking-wider mb-2">{product.category}</span>
          <h3 className="font-black text-slate-900 text-xl tracking-tight leading-tight mb-2 group-hover:text-violet-600 transition-colors">{product.name}</h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed flex-1">{product.description}</p>
        </div>
      </Link>
      
      <div className="mt-6 px-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">Price</span>
          <span className="font-black text-2xl text-slate-900 tracking-tight">₹{product.price.toFixed(2)}</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
            toast.success(`${product.name} added to cart!`);
          }}
          disabled={product.stock === 0}
          className="bg-slate-900 hover:bg-violet-600 disabled:bg-slate-200 disabled:text-slate-400 text-white p-4 rounded-2xl transition-all shadow-xl shadow-slate-900/20 hover:shadow-violet-600/30 flex items-center justify-center group/btn"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}
