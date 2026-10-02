import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Star,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { Product, StockStatus } from '../../../types';

interface ProductManagementSectionProps {
  onAddNewClick: () => void;
}

export const ProductManagementSection: React.FC<ProductManagementSectionProps> = ({
  onAddNewClick,
}) => {
  const { products, categories, refreshData } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'ALL' && p.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (statusFilter !== 'ALL' && p.stockStatus !== statusFilter) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Direct stock status change
  const handleStatusChange = async (productId: string, newStatus: StockStatus) => {
    setUpdatingId(productId);
    try {
      await api.updateProductStatus(productId, newStatus);
      await refreshData();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { isFeatured: !product.isFeatured });
      await refreshData();
    } catch (err) {
      alert('Failed to update featured flag');
    }
  };

  // Delete product
  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await api.deleteProduct(product.id);
      await refreshData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Quick inline price update save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await api.updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
        category: editingProduct.category,
        description: editingProduct.description,
        stockStatus: editingProduct.stockStatus,
        isFeatured: editingProduct.isFeatured,
      });
      await refreshData();
      setEditingProduct(null);
    } catch (err) {
      alert('Failed to update product details');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage pricing, stock status, categories, and availability across your watch catalog.
          </p>
        </div>
        <button
          onClick={onAddNewClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search watches by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="IN_STOCK">In Stock (Active)</option>
            <option value="OUT_OF_STOCK">Out of Stock (Disabled Order)</option>
            <option value="OFF">OFF (Hidden from Site)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-900/60 rounded-2xl border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4">Watch</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (PKR)</th>
                <th className="py-3.5 px-4">Direct Availability Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                  {/* Image + Title */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <div className="font-semibold text-neutral-200 truncate">{p.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {p.sku || p.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-amber-500 uppercase">{p.category}</span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold tabular-nums text-neutral-100">
                    Rs. {p.price.toLocaleString()}
                  </td>

                  {/* Direct Stock Status Switcher */}
                  <td className="py-3 px-4">
                    <select
                      value={p.stockStatus}
                      disabled={updatingId === p.id}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as StockStatus)}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                        p.stockStatus === 'IN_STOCK'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : p.stockStatus === 'OUT_OF_STOCK'
                          ? 'bg-red-950/60 text-red-400 border-red-500/40'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-700'
                      }`}
                    >
                      <option value="IN_STOCK">● IN STOCK</option>
                      <option value="OUT_OF_STOCK">● OUT OF STOCK</option>
                      <option value="OFF">● OFF (HIDDEN)</option>
                    </select>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        p.isFeatured
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-neutral-600 hover:text-neutral-400'
                      }`}
                      title={p.isFeatured ? 'Marked as Featured' : 'Not Featured'}
                    >
                      <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                Edit Product
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                    Price (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Category
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Availability Status
                </label>
                <select
                  value={editingProduct.stockStatus}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stockStatus: e.target.value as StockStatus,
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 cursor-pointer"
                >
                  <option value="IN_STOCK">IN STOCK (Active)</option>
                  <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                  <option value="OFF">OFF (Hidden from store)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg font-bold uppercase tracking-wider cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
