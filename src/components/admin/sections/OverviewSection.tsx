import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  MessageCircle,
  Download,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { DashboardStats } from '../../../types';

interface OverviewSectionProps {
  onNavigateTab: (tabId: string) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ onNavigateTab }) => {
  const { navigateToHome } = useStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time analytics and store performance from database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/api/admin/export-zip"
            download
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg shadow-md transition-all cursor-pointer"
            title="Download complete working project files as a ZIP archive"
          >
            <Download className="w-4 h-4" />
            <span>Download Project ZIP</span>
          </a>
          <button
            onClick={navigateToHome}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Store</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Confirmed Revenue
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-100 tabular-nums">
              Rs. {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              From verified website checkouts & confirmed orders
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Total Orders Placed
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neutral-100 tabular-nums">
              {stats?.totalOrders || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {stats?.websiteOrders || 0} Website • {stats?.whatsappOrders || 0} WhatsApp
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 tabular-nums">
              {stats?.pendingOrders || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Awaiting dispatch confirmation
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              WhatsApp Inquiries
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">
              {stats?.whatsappOrders || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Direct inquiries via WhatsApp button
            </div>
          </div>
        </div>
      </div>

      {/* Quick Jump Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('add-product')}
          className="p-4 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-left transition-all cursor-pointer"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            + Add New Product
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Publish watch model with multiple photos
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('category-management')}
          className="p-4 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-left transition-all cursor-pointer"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Manage Categories
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Update images, names & categories
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="p-4 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-left transition-all cursor-pointer"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Manage Orders
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            View customer details, addresses & statuses
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('homepage-slider')}
          className="p-4 rounded-xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-left transition-all cursor-pointer"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Hero Slider
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Update carousel banners and buttons
          </div>
        </button>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-neutral-100 uppercase tracking-tight">
              Recent Orders
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Latest website checkouts and WhatsApp requests
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-amber-500 hover:text-amber-400 cursor-pointer"
          >
            View All Orders &rarr;
          </button>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950/80 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Total Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-semibold text-amber-400">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-neutral-200">{order.customer.fullName}</div>
                      <div className="text-[10px] text-neutral-500">{order.customer.phone}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          order.type === 'website'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {order.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold tabular-nums text-neutral-100">
                      Rs. {order.pricing.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          order.status === 'confirmed' || order.status === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-neutral-500 text-xs">
            No orders placed yet. Place an order on the storefront to test!
          </div>
        )}
      </div>
    </div>
  );
};
