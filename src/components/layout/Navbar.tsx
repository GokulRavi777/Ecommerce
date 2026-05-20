'use client';

import Link from 'next/link';
import { ShoppingCart, Store, Shield } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const cart = useStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Admin', href: '/admin', icon: Shield },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5 rounded-xl text-white shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300">
            <Store className="h-5 w-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-900 to-fuchsia-800">
            SchoolSupplies
          </span>
        </Link>
        
        <div className="flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center font-semibold text-sm transition-all duration-300 ${
                  isActive ? 'text-violet-600' : 'text-slate-500 hover:text-violet-600'
                }`}
              >
                {Icon && <Icon className="h-4 w-4 mr-1.5" />}
                {link.name}
              </Link>
            );
          })}
          
          <Link href="/cart" className="relative group">
            <div className="p-3 bg-slate-100/80 rounded-2xl group-hover:bg-violet-100 transition-colors duration-300 text-slate-700 group-hover:text-violet-700">
              <ShoppingCart className="h-5 w-5" />
            </div>
            {mounted && cartItemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-pink-500/30 border-2 border-white"
              >
                {cartItemCount}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
