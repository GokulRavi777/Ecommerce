'use client';

import { useStore } from '@/store/useStore';
import ProductGrid from '@/components/product/ProductGrid';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const products = useStore((state) => state.products);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-96 flex items-center justify-center">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
