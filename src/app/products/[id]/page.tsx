'use client';

import { useStore } from '@/store/useStore';
import { notFound } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, fetchProducts, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]);

  if (!mounted) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  const product = products.find(p => p.id === id);

  if (!product) {
    return notFound();
  }

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* 🧭 Breadcrumb & Back navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/products" 
          className="inline-flex items-center text-slate-500 hover:text-violet-600 font-bold transition-colors group text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Link>
        <span className="text-xs text-slate-400 font-medium hidden sm:block">
          Catalog / {product.category} / {product.name}
        </span>
      </div>

      {/* 📦 Master Product Card */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* 📷 Product Image Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="aspect-square bg-slate-50/70 rounded-[2rem] overflow-hidden border border-slate-100 relative group"
        >
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
              No image uploaded
            </div>
          )}

          {/* Low Stock/Sold Out Badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            {isOutOfStock && (
              <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-rose-500/20">
                Sold Out
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-amber-500/20">
                Only {product.stock} units left!
              </span>
            )}
          </div>

          {/* Like Button */}
          <button 
            onClick={() => {
              setIsLiked(!isLiked);
              toast.success(isLiked ? 'Removed from favorites' : 'Saved to favorites');
            }}
            className="absolute top-5 right-5 p-3.5 bg-white/80 backdrop-blur-md rounded-2xl hover:bg-white text-slate-400 hover:text-rose-500 transition-all border border-slate-100 shadow-sm cursor-pointer"
          >
            <Heart className={`w-5 h-5 transition-transform active:scale-90 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </motion.div>

        {/* 📄 Product Details Sheet */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <span className="bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-violet-100/50 inline-block">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-slate-400 font-medium">
              <span>Item ID:</span>
              <span className="font-bold text-slate-600">{product.id.slice(0, 8)}...</span>
            </div>
          </div>
          
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
            {product.description}
          </p>
          
          <div className="py-6 border-y border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Price</span>
              <span className="text-4xl font-black text-slate-900 tracking-tight">₹{product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Availability</span>
              <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-center ${
                isOutOfStock ? 'bg-rose-100 text-rose-700' :
                isLowStock ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {isOutOfStock ? 'Temporarily Unavailable' :
                 isLowStock ? `Low Stock (${product.stock} items)` :
                 `In Stock (${product.stock} items)`}
              </span>
            </div>
          </div>

          {/* Action Row */}
          {!isOutOfStock && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-2 sm:max-w-[150px]">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-slate-500 hover:text-violet-600 disabled:opacity-40 disabled:hover:text-slate-500 transition-colors font-black text-lg"
                >
                  -
                </button>
                <span className="font-bold text-slate-800 text-base w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-slate-500 hover:text-violet-600 disabled:opacity-40 disabled:hover:text-slate-500 transition-colors font-black text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  // Add designated quantity to cart
                  for (let i = 0; i < quantity; i++) {
                    addToCart(product);
                  }
                  toast.success(`${quantity} x ${product.name} added to cart!`);
                  setQuantity(1);
                }}
                className="flex-1 bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-slate-900/10 hover:shadow-violet-600/30 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add {quantity} to Cart</span>
              </button>
            </div>
          )}

          {isOutOfStock && (
            <button
              disabled
              className="w-full bg-slate-100 text-slate-400 font-bold py-4 rounded-2xl cursor-not-allowed text-center"
            >
              Sold Out
            </button>
          )}

          {/* Brand/Product Features Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            {[
              { icon: Truck, text: "Free Shipping" },
              { icon: ShieldCheck, text: "Secure Payment" },
              { icon: RefreshCw, text: "Simple Returns" }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                <feature.icon className="w-4 h-4 text-slate-500 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">{feature.text}</span>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
