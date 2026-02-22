"use client";
import { useState } from 'react';
import ProductSearch from './ProductSearch'; 
import { ArrowUpRight, ArrowDownLeft, Loader2, CheckCircle2, Package, Plus, Minus, AlertCircle } from 'lucide-react';

interface InventoryActionProps {
  onSuccess: () => void;
}

export default function InventoryAction({ onSuccess }: InventoryActionProps) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for professional error handling

  const handleTransaction = async (type: 'IN' | 'OUT') => {
    const qtyNumber = parseInt(quantity);
    if (!selectedProduct || isNaN(qtyNumber) || qtyNumber <= 0) {
        setError("Please select a product and valid quantity.");
        setTimeout(() => setError(null), 3000);
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://warehouse-xn8e.vercel.app/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: selectedProduct.name,
          quantity: qtyNumber,
          type: type 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // This catches the "Insufficient stock" error from your FastAPI
        throw new Error(data.detail || "Transaction failed");
      }

      setQuantity("1");
      setSelectedProduct(null);
      setShowSuccess(true);
      onSuccess();

      setTimeout(() => setShowSuccess(false), 1500);

    } catch (err: any) {
      console.error("Transaction error:", err);
      setError(err.message);
      // Clear error after 4 seconds
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const adjustQty = (amt: number) => {
    const current = parseInt(quantity) || 0;
    setQuantity(Math.max(1, current + amt).toString());
  };

  return (
    <div className="relative bg-white dark:bg-zinc-950 p-6 md:p-10 rounded-3xl shadow-2xl shadow-blue-500/5 border border-zinc-100 dark:border-zinc-800 max-w-2xl mx-auto overflow-hidden transition-all">
      
      {/* Background Icon Decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
        <Package size={120} className="text-zinc-900 dark:text-white" />
      </div>

      <div className="relative mb-8">
        <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Quick Log
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
          Manage warehouse flow with real-time stock updates.
        </p>
      </div>

      {/* Professional Error Notification Toast */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="text-rose-600 dark:text-rose-400 shrink-0" size={20} />
          <p className="text-sm font-bold text-rose-800 dark:text-rose-200">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Step 1: Product Selection */}
        <div className="group">
          <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            <span className="w-5 h-px bg-zinc-200 dark:bg-zinc-800"></span>
            01. Select Item
          </label>
          <ProductSearch selected={selectedProduct} setSelected={setSelectedProduct} />
        </div>

        {/* Step 2: Quantity Input with Quick Actions */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
            <span className="w-5 h-px bg-zinc-200 dark:bg-zinc-800"></span>
            02. Quantity
          </label>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-xl font-bold text-zinc-900 dark:text-zinc-100"
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-2">
                <button onClick={() => adjustQty(1)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"><Plus size={16}/></button>
                <button onClick={() => adjustQty(-1)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"><Minus size={16}/></button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            {[5, 10, 20, 50].map(val => (
                <button 
                  key={val} 
                  onClick={() => setQuantity(val.toString())}
                  className="px-3 py-1 text-[10px] font-bold border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 hover:border-blue-500 hover:text-blue-500 transition-all"
                >
                    +{val}
                </button>
            ))}
          </div>
        </div>

        {/* Step 3: Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <button 
            disabled={loading || !selectedProduct || !quantity}
            onClick={() => handleTransaction('IN')}
            className="group flex items-center justify-center gap-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-5 rounded-2xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowDownLeft size={20} className="text-emerald-500" />}
            Stock In
          </button>

          <button 
            disabled={loading || !selectedProduct || !quantity}
            onClick={() => handleTransaction('OUT')}
            className="group flex items-center justify-center gap-3 border-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-bold py-5 rounded-2xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowUpRight size={20} className="text-rose-500" />}
            Stock Out
          </button>
        </div>
      </div>

      {/* Professional Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in duration-300">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full mb-4">
            <CheckCircle2 size={50} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Stock Updated</h3>
          <p className="text-zinc-500 text-sm font-medium">Database successfully synchronized.</p>
        </div>
      )}
    </div>
  );
}