import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { StockStatus } from '../../../types';

export const StockManagementSection: React.FC = () => {
  const { products, refreshData } = useStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (productId: string, status: StockStatus) => {
    setUpdatingId(productId);
    try {
      await api.updateProductStatus(productId, status);
      await refreshData();
    } catch {
      alert('Failed to update stock status');
    } finally {
      setUpdatingId(null);
    }
  };

  const inStockCount = products.filter((p) => p.stockStatus === 'IN_STOCK').length;
  const outOfStockCount = products.filter((p) => p.stockStatus === 'OUT_OF_STOCK').length;
  const offCount = products.filter((p) => p.stockStatus === 'OFF').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Stock & Inventory Management
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Quickly switch inventory availability across your watch models with instant storefront sync.
        </p>
      </div>

      {/* Status Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            In Stock & Ready
          </div>
          <div className="text-2xl font-bold text-emerald-300 mt-1 tabular-nums">
            {inStockCount} Models
          </div>
        </div>

        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
          <div className="text-xs font-semibold text-red-400 uppercase tracking-wider">
            Out of Stock
          </div>
          <div className="text-2xl font-bold text-red-300 mt-1 tabular-nums">
            {outOfStockCount} Models
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            OFF (Hidden Publicly)
          </div>
          <div className="text-2xl font-bold text-neutral-300 mt-1 tabular-nums">
            {offCount} Models
          </div>
        </div>
      </div>

      {/* Matrix list */}
      <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-4 bg-neutral-950/80 border-b border-neutral-800 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Quick Stock Availability Switcher
        </div>
        <div className="divide-y divide-neutral-800/60">
          {products.map((p) => (
            <div
              key={p.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-200">{p.name}</h4>
                  <div className="text-[11px] text-neutral-500">
                    <span className="text-amber-500 font-medium uppercase">{p.category}</span> • Rs.{' '}
                    {p.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status Radio Buttons / Segmented Control */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                <button
                  onClick={() => handleStatusChange(p.id, 'IN_STOCK')}
                  disabled={updatingId === p.id}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    p.stockStatus === 'IN_STOCK'
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-emerald-400'
                  }`}
                >
                  In Stock
                </button>
                <button
                  onClick={() => handleStatusChange(p.id, 'OUT_OF_STOCK')}
                  disabled={updatingId === p.id}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    p.stockStatus === 'OUT_OF_STOCK'
                      ? 'bg-red-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-red-400'
                  }`}
                >
                  Out of Stock
                </button>
                <button
                  onClick={() => handleStatusChange(p.id, 'OFF')}
                  disabled={updatingId === p.id}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    p.stockStatus === 'OFF'
                      ? 'bg-neutral-200 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  OFF (Hide)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
