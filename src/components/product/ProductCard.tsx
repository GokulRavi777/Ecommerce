'use client';

import { Product } from '@/types/product';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] transition-all border border-slate-100 flex flex-col h-full group"
    >
      <Link href={`/products/${product.id}`} className="flex-1 flex flex-col relative">
        {/* Product Image Container */}
        <div className="aspect-[4/5] bg-slate-50 rounded-2xl mb-5 overflow-hidden relative border border-slate-100/50">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-semibold bg-gradient-to-br from-slate-50 to-slate-100 text-sm">
              No image uploaded
            </div>
          )}
          
          {/* Subtle Ambient Hover Overlay */}
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 text-slate-800">
              <Eye className="w-5 h-5 text-violet-600" />
            </span>
          </div>

          {/* Absolute Badge Panel */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {isOutOfStock && (
              <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-rose-500/25">
                Sold Out
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/25 animate-pulse">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
        
        {/* Product Metadata & Info */}
        <div className="px-1 flex-1 flex flex-col space-y-2">
          <span className="text-violet-600 text-[10px] font-black uppercase tracking-widest">{product.category}</span>
          <h3 className="font-black text-slate-900 text-lg tracking-tight leading-tight group-hover:text-violet-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed font-semibold line-clamp-2 flex-1">
            {product.description}
          </p>
        </div>
      </Link>
      
      {/* Product Footer Row (Price & CTA Button) */}
      <div className="mt-5 pt-4 border-t border-slate-50 px-1 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Price</span>
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
          disabled={isOutOfStock}
          className="bg-slate-950 hover:bg-violet-600 disabled:bg-slate-100 disabled:text-slate-400 text-white p-3.5 rounded-2xl transition-all shadow-xl shadow-slate-950/10 hover:shadow-violet-600/20 flex items-center justify-center group/btn cursor-pointer"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-4.5 h-4.5 group-hover/btn:scale-105 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}
