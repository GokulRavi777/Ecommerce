'use client';

import { useStore } from '@/store/useStore';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { products, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-96 flex items-center justify-center">Loading...</div>;

  const product = products.find(p => p.id === params.id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/products" className="inline-flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 grid md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-slate-50 rounded-2xl overflow-hidden"
        >
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center space-y-6"
        >
          <div>
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{product.category}</span>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
          </div>
          
          <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          
          <div className="flex items-center justify-between py-6 border-y border-gray-100">
            <span className="text-4xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            <span className={`px-4 py-2 rounded-full font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-semibold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Add to Cart</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
