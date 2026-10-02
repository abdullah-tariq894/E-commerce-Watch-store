import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload, ExternalLink, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { Category } from '../../../types';

export const CategoryManagementSection: React.FC = () => {
  const { categories, products, refreshData, navigateToCategory } = useStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [quickUploadingId, setQuickUploadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Category State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg');

  // Deduplicate categories by slug/id for clean view
  const uniqueCategories = categories.filter(
    (c, idx, arr) =>
      arr.findIndex(
        (item) => item.slug.toLowerCase() === c.slug.toLowerCase() || item.id === c.id
      ) === idx
  );

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Quick 1-click image upload directly from card
  const handleQuickImageUpload = async (cat: Category, file: File) => {
    setQuickUploadingId(cat.id);
    try {
      const res = await api.uploadImage(file);
      await api.updateCategory(cat.id, {
        ...cat,
        image: res.url,
      });
      await refreshData();
      showStatus('success', `Updated image for category "${cat.name}" successfully!`);
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to update category image.');
    } finally {
      setQuickUploadingId(null);
    }
  };

  // Upload handler for edit modal or new category modal
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const res = await api.uploadImage(file);
      if (isEdit && editingCategory) {
        setEditingCategory({ ...editingCategory, image: res.url });
      } else {
        setNewImage(res.url);
      }
      showStatus('success', 'Image uploaded successfully!');
    } catch {
      showStatus('error', 'Image upload failed. Please verify format.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showStatus('error', 'Category name is required.');
      return;
    }
    try {
      await api.addCategory({
        name: newName.trim(),
        description: newDesc.trim(),
        image: newImage.trim(),
      });
      await refreshData();
      setIsAddingNew(false);
      setNewName('');
      setNewDesc('');
      setNewImage('/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg');
      showStatus('success', `Category "${newName}" added successfully!`);
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to add category');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await api.updateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
        slug: editingCategory.slug,
        description: editingCategory.description,
        image: editingCategory.image,
        order: editingCategory.order,
      });
      await refreshData();
      const updatedName = editingCategory.name;
      setEditingCategory(null);
      showStatus('success', `Category "${updatedName}" updated successfully in database!`);
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to update category');
    }
  };

  const handleDelete = async (cat: Category) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete category "${cat.name}"?\n\nThis will remove it from the database and storefront. Products will NOT be deleted.`
    );
    if (!confirmDelete) return;

    try {
      await api.deleteCategory(cat.id);
      await refreshData();
      if (editingCategory?.id === cat.id) {
        setEditingCategory(null);
      }
      showStatus('success', `Category "${cat.name}" deleted successfully from database!`);
    } catch (err: any) {
      showStatus('error', err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            Category Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Fully dynamic category management: Add, edit names, upload/change images, and delete categories with live sync.
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Status Feedback Toast/Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/50 border-red-500/50 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Add New Category Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                Add Brand Category
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Category Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seiko, Tissot, Fossil, Rolex"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Artisan Swiss or Japanese automatic horology engineered with luxury steel..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Category Showcase Image <span className="text-amber-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    placeholder="/uploads/... or image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer border border-neutral-700">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>

                {newImage && (
                  <div className="h-36 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                    <img
                      key={newImage}
                      src={newImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-neutral-950/80 px-2 py-0.5 rounded text-amber-400 border border-amber-500/30">
                      Live Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                Edit Category: {editingCategory.name}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Category Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                    })
                  }
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Slug / URL Path
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category Image Section */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase flex items-center justify-between">
                  <span>Category Image</span>
                  <span className="text-amber-400 font-normal">Immediate live update</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={editingCategory.image}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, image: e.target.value })
                    }
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer border border-neutral-700">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>

                {editingCategory.image && (
                  <div className="h-44 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                    <img
                      key={editingCategory.image}
                      src={editingCategory.image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-neutral-950/80 px-2 py-0.5 rounded text-amber-400 border border-amber-500/30">
                      Current Category Image Preview
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleDelete(editingCategory)}
                  className="px-3.5 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-500/40 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete Category</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of All Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueCategories.map((cat) => {
          const productCount = products.filter(
            (p) =>
              p.category.toLowerCase().replace(/[^a-z0-9]/g, '') ===
              cat.name.toLowerCase().replace(/[^a-z0-9]/g, '')
          ).length;

          const isUploadingThis = quickUploadingId === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-neutral-900/60 rounded-2xl overflow-hidden border border-neutral-800 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              {/* Image Preview with quick replace button */}
              <div className="relative aspect-[16/9] w-full bg-neutral-950 overflow-hidden group">
                <img
                  key={cat.image || cat.id}
                  src={cat.image || '/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                <span className="absolute bottom-3 left-3 text-xs font-bold text-amber-400 bg-neutral-950/80 px-2.5 py-1 rounded border border-amber-500/30">
                  {productCount} Products
                </span>

                {/* Instant Change Image Button */}
                <label
                  className="absolute top-3 right-3 px-2.5 py-1.5 bg-neutral-950/85 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 rounded-md text-[11px] font-semibold border border-neutral-700/80 cursor-pointer flex items-center gap-1.5 shadow-lg transition-all"
                  title="Upload & Change Image Instantly"
                >
                  <Upload className="w-3 h-3" />
                  <span>{isUploadingThis ? 'Saving...' : 'Change Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingThis}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleQuickImageUpload(cat, e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Details & Actions */}
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-neutral-100 uppercase tracking-wide">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-500">
                    /{cat.slug}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2">
                  {cat.description || 'Curated luxury collection.'}
                </p>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => navigateToCategory(cat.slug)}
                    className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Category Details & Image"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Category Button: Fully Functional For All Categories */}
                    <button
                      onClick={() => handleDelete(cat)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title={`Delete "${cat.name}" from database`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
