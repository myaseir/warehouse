"use client";
import { useState } from 'react';
import { Plus, Minus, Loader2, CheckCircle2, PackageSearch } from "lucide-react";
import ProductSearch from './ProductSearch';

interface InventoryFormProps {
  onSuccess: () => void;
}

export default function InventoryForm({ onSuccess }: InventoryFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMovement = async (type: 'IN' | 'OUT') => {
    const qtyNumber = parseInt(quantity);
    
    // Validation
    if (!selectedProduct || isNaN(qtyNumber) || qtyNumber <= 0) {
      alert("Please select a product and enter a valid quantity.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // PRO TIP: Make sure this URL is exactly where your FastAPI is hosted
      const response = await fetch('https://warehouse-xn8e.vercel.app/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: selectedProduct.name,
          quantity: qtyNumber,
          type: type // Will send "IN" or "OUT"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Backend connection failed");
      }

      // Success workflow
      setQuantity("1");
      setSelectedProduct(null);
      setShowSuccess(true);
      
      // TRIGGER REFRESH: This tells page.tsx to reload the table
      onSuccess();
      
      setTimeout(() => setShowSuccess(false), 1500);

    } catch (error: any) {
      console.error("Movement log failed:", error);
      setErrorMessage(error.message);
      // Automatically clear error after 3 seconds
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-6 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all">
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
          {/* Quantity Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Quantity
            </label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-4 focus:ring-blue-500/10 outline-none font-mono font-bold text-zinc-900 dark:text-zinc-100"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Movement Type
            </label>
            <div className="flex gap-3">
              <button 
                disabled={loading || !selectedProduct}
                onClick={() => handleMovement('IN')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} 
                Stock In
              </button>
              
              <button 
                disabled={loading || !selectedProduct}
                onClick={() => handleMovement('OUT')}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Minus size={18} />} 
                Stock Out
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Error Message */}
        {errorMessage && (
          <p className="text-rose-500 text-xs font-bold animate-pulse text-center">
            Error: {errorMessage}
          </p>
        )}
      </div>

      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl animate-in fade-in zoom-in duration-300">
          <CheckCircle2 size={40} className="text-emerald-600 mb-2" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Success!</h3>
          <p className="text-zinc-500 text-sm">Inventory updated instantly.</p>
        </div>
      )}
    </div>
  );
}