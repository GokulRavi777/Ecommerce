'use client';

import { useStore } from '@/store/useStore';
import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Box, Image as ImageIcon, Tag, DollarSign, Archive, ClipboardList } from 'lucide-react';
import { Product } from '@/types/product';
import { OrderStatus } from '@/types/order';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [isEditing, setIsEditing] = useState<string | null>(null);

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
  }, []);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct(isEditing, formData);
      setIsEditing(null);
    } else {
      addProduct({
        ...formData,
        id: crypto.randomUUID(),
      } as Product);
    }
    setFormData({ name: '', description: '', price: 0, imageUrl: '', category: '', stock: 0 });
  };

  const editProduct = (product: Product) => {
    setIsEditing(product.id);
    setFormData(product);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-purple-100 text-purple-700';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
            <Box className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your store's inventory and orders.</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Orders
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'products' ? (
          <motion.div 
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-12 gap-10"
          >
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-28">
                <h2 className="text-2xl font-bold mb-8 text-slate-900 flex items-center">
                  {isEditing ? <><Edit2 className="w-5 h-5 mr-2 text-violet-500" /> Edit Product</> : <><Plus className="w-5 h-5 mr-2 text-violet-500" /> Add New Product</>}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Name</label>
                    <div className="relative">
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" placeholder="Product name" />
                      <Tag className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Description</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium min-h-[100px]" placeholder="Brief description..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Price (₹)</label>
                      <div className="relative">
                        <input required type="number" step="0.01" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" placeholder="0.00" />
                        <DollarSign className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Stock</label>
                      <div className="relative">
                        <input required type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" placeholder="0" />
                        <Archive className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Category</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" placeholder="e.g. Notebooks, Pens" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Image URL</label>
                    <div className="relative">
                      <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all font-medium" placeholder="https://..." />
                      <ImageIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-violet-600/30">
                      {isEditing ? 'Save Changes' : 'Create Product'}
                    </button>
                    {isEditing && (
                      <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: '', description: '', price: 0, imageUrl: '', category: '', stock: 0 }); }} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors mt-3">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100">Product</th>
                      <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100">Price</th>
                      <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100">Stock</th>
                      <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">Your inventory is empty. Add a product to get started.</td>
                      </tr>
                    ) : (
                      products.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{product.name}</div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">{product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 font-bold text-slate-700">₹{product.price.toFixed(2)}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button onClick={() => editProduct(product)} className="p-2.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteProduct(product.id)} className="p-2.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
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
          </motion.div>
        ) : (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100">Order ID & Date</th>
                    <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100">Customer & Items</th>
                    <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100">Total</th>
                    <th className="px-8 py-5 font-bold text-slate-600 uppercase tracking-wider text-xs border-b border-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center">
                          <ClipboardList className="w-10 h-10 mb-3 text-slate-300" />
                          <p>No orders have been placed yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="font-bold text-slate-900">{order.id}</div>
                          <div className="text-xs font-semibold text-slate-400 mt-1">{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-bold text-slate-900">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</div>
                          <div className="text-xs font-semibold text-slate-500 mt-1">{order.items.length} item(s) • {order.shippingDetails.city}</div>
                        </td>
                        <td className="px-8 py-5 font-bold text-slate-700">₹{order.total.toFixed(2)}</td>
                        <td className="px-8 py-5">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-none focus:ring-2 focus:ring-violet-500 outline-none cursor-pointer ${getStatusColor(order.status)}`}
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
