"use client";
import { useState, useEffect } from "react";
// Ensure these filenames match your actual files in the components folder
import InventoryForm from "./components/InventoryForm"; 
import InventoryTable from "./components/InventoryTable";
import Login from "./components/Login";
import { LogOut, LayoutDashboard, Database } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsInitialCheck(false);
  }, []);

  // This function is triggered by the Form to refresh the Table
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  // Professional Loading State for the Initial Session Check
  if (isInitialCheck) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Initializing Warehouse Logs...</p>
      </div>
    );
  }

  // Show Login Screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-blue-100">
      
      {/* Navigation Bar */}
      <nav className="border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-sm text-center">WL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
                Warehouse Log
              </h1>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Management System</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold">API Online</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content Container */}
      <main className="max-w-5xl mx-auto p-4 lg:p-10 space-y-12">
        
        {/* Section 1: Entry Form */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-6">
            <LayoutDashboard size={20} className="text-zinc-400" />
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Stock Movement</h2>
          </div>
          {/* Passing handleRefresh to ensure table updates after form submission */}
          <InventoryForm onSuccess={handleRefresh} />
        </section>

        {/* Section 2: Inventory Tracking Table */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-2 mb-6">
            <Database size={20} className="text-zinc-400" />
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Inventory Analytics</h2>
          </div>
          {/* key={refreshKey} forces the table to re-fetch when form is submitted */}
          <InventoryTable key={refreshKey} />
        </section>

      </main>

      {/* Infrastructure Footer */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950/50 mt-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-2 text-center">
          <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em]">
            System Infrastructure
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
             <span className="text-xs text-zinc-500 font-medium">FastAPI</span>
             <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
             <span className="text-xs text-zinc-500 font-medium">MongoDB Atlas</span>
             <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
             <span className="text-xs text-zinc-500 font-medium">Next.js 14</span>
             <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
             <span className="text-xs text-zinc-500 font-medium">Vercel Deployment</span>
          </div>
          <p className="mt-4 text-[10px] text-zinc-400 font-medium italic">
            Developed for NUML CS Final Year Project
          </p>
        </div>
      </footer>
    </div>
  );
}