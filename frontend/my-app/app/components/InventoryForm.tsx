"use client";
import { useState } from 'react';
import { Search, Plus, Minus, Loader2, CheckCircle2, PackageSearch } from "lucide-react";
import ProductSearch from './ProductSearch'; // Reusing your existing professional search

interface InventoryFormProps {
  onSuccess: () => void;
}

export default function InventoryForm({ onSuccess }: InventoryFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMovement = async (type: 'IN' | 'OUT') => {
    const qtyNumber = parseInt(quantity);
    if (!selectedProduct || isNaN(qtyNumber) || qtyNumber <= 0) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: selectedProduct.name,
          quantity: qtyNumber,
          type: type 
        })
      });

      if (!response.ok) throw new Error("Backend response error");

      // Success workflow
      setQuantity("1");
      setSelectedProduct(null);
      setShowSuccess(true);
      onSuccess();
      setTimeout(() => setShowSuccess(false), 1000);

    } catch (error) {
      console.error("Movement log failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-6 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <PackageSearch className="text-blue-600" size={20} />
        </div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Log Movement</h2>
      </div>
      
      <div className="space-y-6">
        {/* Product Selection */}
        <div className="relative">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
            Product Identification
          </label>
          <ProductSearch selected={selectedProduct} setSelected={setSelectedProduct} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enhanced Quantity Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Quantity
            </label>
            <div className="relative group">
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono font-bold text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
          
          {/* Professional Action Buttons */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Movement Type
            </label>
            <div className="flex gap-3">
              <button 
                disabled={loading || !selectedProduct}
                onClick={() => handleMovement('IN')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:grayscale text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} 
                Stock In
              </button>
              
              <button 
                disabled={loading || !selectedProduct}
                onClick={() => handleMovement('OUT')}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 disabled:grayscale text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Minus size={18} />} 
                Stock Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Success State Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl animate-in fade-in zoom-in duration-300">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mb-3">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Movement Recorded</h3>
          <p className="text-zinc-500 text-sm">Inventory levels updated</p>
        </div>
      )}
    </div>
  );
}