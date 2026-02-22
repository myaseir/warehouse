"use client";
import { useState, useEffect } from "react";
import { Search, Loader2, AlertCircle, Package, Filter, MoreVertical, ArrowUpDown } from "lucide-react";

interface Product {
  id: string | number;
  name: string;
  category?: string;
  stock?: number;
}

export default function InventoryTable() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const LOW_STOCK_THRESHOLD = 5;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/products');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setInventory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Table Header Section */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Package size={20} className="text-blue-600" />
            Stock Inventory
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-medium">Monitoring {inventory.length} items across the warehouse</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-zinc-100"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            <Filter size={18} className="text-zinc-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <span className="text-sm font-medium text-zinc-500">Retrieving records...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Item Details</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 text-center">
                   <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-blue-600">
                      Current Qty <ArrowUpDown size={12} />
                   </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 text-right">Inventory Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const displayAmount = item.stock ?? 0;
                  const isLow = displayAmount > 0 && displayAmount <= LOW_STOCK_THRESHOLD;
                  const isEmpty = displayAmount <= 0;

                  return (
                    <tr key={item.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 transition-colors">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.category || "Uncategorized"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-lg font-bold font-mono text-zinc-800 dark:text-zinc-200">
                          {displayAmount.toString().padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isLow && <AlertCircle size={14} className="text-amber-500 animate-pulse" />}
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${
                            isEmpty 
                              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800' 
                              : isLow 
                                ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800' 
                                : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
                          }`}>
                            {isEmpty ? "Out of Stock" : isLow ? "Low Level" : "In Stock"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <Package size={40} className="opacity-20" />
                      <p className="text-sm font-medium">No inventory items matching "{searchTerm}"</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}