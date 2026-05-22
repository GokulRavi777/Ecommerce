'use client';

import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/product/ProductGrid';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, Tag } from 'lucide-react';

export default function ProductsPage() {
  const { products, fetchProducts } = useStore();
  const [mounted, setMounted] = useState(false);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]);

  // Extract all categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  if (!mounted) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Loading catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
      {/* 🏷️ Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none">
          Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Collection</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          Unlock your next level of creativity and study efficiency with our highly premium, sustainably sourced school essentials.
        </p>
      </div>

      {/* 🔍 Search & Filters Bar */}
      <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100/80 grid md:grid-cols-12 gap-5 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <input 
            type="text" 
            placeholder="Search our catalog..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-3 relative">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-semibold text-slate-600 appearance-none cursor-pointer"
          >
            <option value="default">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <ArrowUpDown className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Categories Count Widget */}
        <div className="md:col-span-3 text-right pr-2 hidden md:block">
          <span className="text-slate-400 font-medium text-sm">Showing </span>
          <span className="text-slate-800 font-black text-lg">{filteredProducts.length}</span>
          <span className="text-slate-400 font-medium text-sm"> products</span>
        </div>
      </div>

      {/* 🏷️ Categories Horizontal Tabs Scrollable */}
      <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide no-scrollbar -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 flex items-center gap-2 ${
              selectedCategory === cat 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                : 'bg-white hover:bg-slate-100 text-slate-500 border border-slate-100 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* 🛍️ Product Grid Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory + searchQuery + sortBy + filteredProducts.length}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 max-w-2xl mx-auto flex flex-col items-center justify-center p-8 space-y-5">
              <div className="p-5 bg-violet-50 text-violet-600 rounded-full">
                <SlidersHorizontal className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">No products matched</h3>
                <p className="text-slate-500 font-medium text-sm max-w-sm mx-auto">
                  Try adjusting your search criteria, clearing search text, or selecting another category tab.
                </p>
              </div>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSortBy('default'); }}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
