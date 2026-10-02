import React, { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  Trash2,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../../services/api';
import { Order, OrderStatus } from '../../../types';

export const OrdersManagementSection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch {
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;
    try {
      await api.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch {
      alert('Failed to delete order');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (typeFilter !== 'ALL' && o.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track, verify, and update website checkouts and WhatsApp ordering requests.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3.5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700 transition-colors cursor-pointer"
        >
          Refresh Orders ({orders.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search order ID, customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="ALL">All Order Types (Website & WhatsApp)</option>
          <option value="website">Website Checkouts Only</option>
          <option value="whatsapp">WhatsApp Inquiries Only</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Items / Qty</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-400">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-200">{o.customer.fullName}</div>
                      <div className="text-[11px] text-neutral-400">{o.customer.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          o.type === 'website'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {o.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-200">
                        {o.items.reduce((sum, i) => sum + i.quantity, 0)} watch(es)
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate max-w-[150px]">
                        {o.items[0]?.name}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold tabular-nums text-neutral-100">
                      Rs. {o.pricing.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider border cursor-pointer ${
                          o.status === 'confirmed' || o.status === 'delivered'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                            : o.status === 'cancelled'
                            ? 'bg-red-950/60 text-red-400 border-red-500/40'
                            : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                          title="Delete Order"
                        >
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-neutral-100 uppercase">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      selectedOrder.type === 'website'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {selectedOrder.type}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-PK')}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white p-1 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
              <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-[11px] pb-1 border-b border-neutral-800/80">
                Customer & Delivery Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-neutral-500">Name:</span>{' '}
                  <span className="text-neutral-200 font-semibold">{selectedOrder.customer.fullName}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Phone:</span>{' '}
                  <a
                    href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>{selectedOrder.customer.phone}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500">Email:</span>{' '}
                  <span className="text-neutral-200">{selectedOrder.customer.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-neutral-500">City / Area:</span>{' '}
                  <span className="text-neutral-200">
                    {selectedOrder.customer.area}, {selectedOrder.customer.city}
                  </span>
                </div>
              </div>
              <div className="pt-1">
                <span className="text-neutral-500">Address:</span>{' '}
                <span className="text-neutral-200">{selectedOrder.customer.address}</span>
              </div>
              {selectedOrder.customer.notes && (
                <div className="pt-1 text-amber-400/90">
                  <span className="text-neutral-500">Notes:</span> <em>{selectedOrder.customer.notes}</em>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-neutral-200 uppercase tracking-wider text-xs">
                Ordered Products ({selectedOrder.items.length})
              </h4>
              <div className="bg-neutral-950 rounded-xl border border-neutral-800 divide-y divide-neutral-800/60 overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-neutral-900 overflow-hidden border border-neutral-800 shrink-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-200">{item.name}</div>
                        <div className="text-[10px] text-neutral-500">
                          Qty: {item.quantity} • Rs. {item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold tabular-nums text-neutral-100">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span>Rs. {selectedOrder.pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Delivery Charges:</span>
                <span className={selectedOrder.pricing.deliveryFee === 0 ? 'text-emerald-400' : ''}>
                  {selectedOrder.pricing.deliveryFee === 0
                    ? 'FREE (Karachi Promotion)'
                    : `Rs. ${selectedOrder.pricing.deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-neutral-100 text-sm pt-2 border-t border-neutral-800">
                <span>Total Amount:</span>
                <span className="text-amber-400">
                  Rs. {selectedOrder.pricing.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Status Control in Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-neutral-400 uppercase font-semibold">Change Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-bold text-neutral-200 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <a
                href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hello ${selectedOrder.customer.fullName}! Regarding your watch Order #${selectedOrder.orderNumber} from Perfect Time Collection...`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
