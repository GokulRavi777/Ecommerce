'use client';

import { useRouter } from "next/navigation";
import { updateProductAction } from "@/app/actions/dbActions";
import { useStore } from '@/store/useStore';
import { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, Edit2, Plus, Box, Image as ImageIcon, 
  Tag, DollarSign, Archive, ClipboardList, AlertCircle, 
  CheckCircle2, TrendingUp, ShoppingBag, Eye 
} from 'lucide-react';
import { Product } from '@/types/product';
import { OrderStatus } from '@/types/order';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminPage() {
    const router = useRouter();
  const { 
    products, fetchProducts, addProduct, updateProduct, deleteProduct, 
    orders, fetchOrders, updateOrderStatus 
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0,
  });

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  // Dynamic Metrics Calculations
  const metrics = useMemo(() => {
    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((acc, curr) => acc + curr.total, 0);

    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

    return {
      totalRevenue,
      outOfStockCount,
      activeOrdersCount,
      totalProducts: products.length
    };
  }, [products, orders]);

  if (!mounted) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Loading Admin Center...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    if (isEditing) {
      // ✅ SERVER UPDATE (correct)
      await updateProductAction(isEditing, formData);

      // ✅ sync Zustand
      await fetchProducts();

      toast.success(`"${formData.name}" updated successfully!`);
      setIsEditing(null);

    } else {
      const newProduct: Product = {
        ...formData,
        id: `PROD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      } as Product;

      await addProduct(newProduct);
      toast.success(`"${formData.name}" added to store!`);
    }

    setFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      stock: 0,
    });

    // ✅ force UI refresh
    router.refresh();

  } catch (err) {
    console.error('Admin submit error:', err);
    toast.error('Operation failed');
  } finally {
    setIsSubmitting(false);
  }
};

  const editProduct = (product: Product) => {
    setIsEditing(product.id);
    setFormData(product);
  };
  ;



  const handleOrderChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order ${orderId} updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4">
      {/* 🧭 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-violet-600 text-white rounded-2xl shadow-lg shadow-violet-600/20">
            <Box className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">Admin Dashboard</h1>
            <p className="text-slate-500 font-semibold mt-1.5 text-xs">Full database control of inventory and transactions.</p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start md:self-auto">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'products' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-white text-slate-950 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* 📊 Metrics Widgets Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Sales", value: `₹${metrics.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { title: "Active Orders", value: metrics.activeOrdersCount, icon: ShoppingBag, color: "text-violet-600 bg-violet-50 border-violet-100" },
          { title: "Items Listed", value: metrics.totalProducts, icon: Box, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { title: "Out of Stock", value: metrics.outOfStockCount, icon: AlertCircle, color: metrics.outOfStockCount > 0 ? "text-rose-600 bg-rose-50 border-rose-100" : "text-slate-400 bg-slate-50 border-slate-100" },
        ].map((widget, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex items-center justify-between`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{widget.title}</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight leading-none block">{widget.value}</span>
            </div>
            <div className={`p-3.5 rounded-2xl ${widget.color}`}>
              <widget.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* 📄 Content Tabs Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'products' ? (
          <motion.div 
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-12 gap-10"
          >
            {/* Form Column */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 sticky top-24">
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8 flex items-center">
                  {isEditing ? (
                    <><Edit2 className="w-5 h-5 mr-3 text-violet-600" /> Edit Product</>
                  ) : (
                    <><Plus className="w-5 h-5 mr-3 text-violet-600" /> Add Product</>
                  )}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Product Name</label>
                    <div className="relative">
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" placeholder="e.g. Hardcover Journal" />
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Description</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800 min-h-[100px]" placeholder="Explain details..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Price (₹)</label>
                      <div className="relative">
                        <input required type="number" step="0.01" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value === '' ? formData.price : parseFloat(e.target.value)})} className="w-full pl-9 pr-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" placeholder="0.00" />
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Stock</label>
                      <div className="relative">
                        <input required type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value === '' ? formData.stock : parseInt(e.target.value)})} className="w-full pl-9 pr-3 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" placeholder="0" />
                        <Archive className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Category</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" placeholder="e.g. Notebooks, Pens" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Image URL</label>
                    <div className="relative">
                      <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium text-slate-800" placeholder="https://unsplash..." />
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2.5">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-slate-950 hover:bg-violet-600 disabled:bg-slate-200 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-950/10 cursor-pointer">
                      {isSubmitting ? 'Processing...' : isEditing ? 'Save Changes' : 'Create Product'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: '', description: '', price: 0, imageUrl: '', category: '', stock: 0 }); }} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl transition-colors border border-slate-200/60 cursor-pointer">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Inventory List Column */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.01)] border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Product</th>
                        <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Price</th>
                        <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Stock</th>
                        <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-semibold">Your store inventory is empty. Add a product to seed.</td>
                        </tr>
                      ) : (
                        products.map(product => (
                          <tr key={product.id} className="hover:bg-slate-50/40 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center space-x-4">
                                <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                                  {product.imageUrl ? (
                                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <ImageIcon className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors truncate">{product.name}</div>
                                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{product.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5 font-black text-slate-700">₹{product.price.toFixed(2)}</td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                product.stock > 5 ? 'bg-emerald-100 text-emerald-700' :
                                product.stock > 0 ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'
                              }`}>
                                {product.stock === 0 ? 'Sold Out' : `${product.stock} Units`}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button onClick={() => editProduct(product)} className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all cursor-pointer">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => { if(confirm(`Delete ${product.name}?`)) deleteProduct(product.id); }} className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all cursor-pointer">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Orders tab panel */
          <motion.div 
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.01)] border border-slate-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] text-sm">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Order ID & Date</th>
                    <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Customer Details</th>
                    <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Items Ordered</th>
                    <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Total</th>
                    <th className="px-8 py-5 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100">Checkout Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-semibold">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <ClipboardList className="w-9 h-9 text-slate-300" />
                          <p>No customer orders have been received yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-black text-slate-900">{order.id}</div>
                          <div className="text-[10px] font-bold text-slate-400 mt-1">
                            {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-8 py-5 font-semibold text-slate-800">
                          <div>{order.shippingDetails.firstName} {order.shippingDetails.lastName}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{order.shippingDetails.city}, Zip: {order.shippingDetails.zipCode}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="space-y-1">
                            {order.items.map(item => (
                              <div key={item.id} className="text-xs text-slate-600 font-medium">
                                • {item.name} <span className="font-bold text-slate-800">(x{item.quantity})</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-5 font-black text-slate-700">₹{order.total.toFixed(2)}</td>
                        <td className="px-8 py-5">
                          <select 
                            value={order.status}
                            onChange={(e) => handleOrderChange(order.id, e.target.value as OrderStatus)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider outline-none cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
