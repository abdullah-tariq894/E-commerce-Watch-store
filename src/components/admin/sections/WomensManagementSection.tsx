import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { WomensItem } from '../../../types';

export const WomensManagementSection: React.FC = () => {
  const { womensItems, refreshData } = useStore();
  const [editingItem, setEditingItem] = useState<WomensItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  // New item form
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/images/womens_luxury_watch_showcase_1790915335990.jpg');
  const [newLink, setNewLink] = useState('/category/curren');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const res = await api.uploadImage(file);
      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, image: res.url });
      } else {
        setNewImage(res.url);
      }
    } catch {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) return;
    try {
      await api.addWomensItem({
        title: newTitle,
        subtitle: newSubtitle,
        price: Number(newPrice),
        originalPrice: newOriginalPrice ? Number(newOriginalPrice) : undefined,
        image: newImage,
        link: newLink,
        isEnabled: true,
      });
      await refreshData();
      setIsAddingNew(false);
      setNewTitle('');
      setNewSubtitle('');
      setNewPrice('');
    } catch {
      alert('Failed to add item');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await api.updateWomensItem(editingItem.id, editingItem);
      await refreshData();
      setEditingItem(null);
    } catch {
      alert('Failed to update item');
    }
  };

  const handleToggleEnabled = async (item: WomensItem) => {
    try {
      await api.updateWomensItem(item.id, { isEnabled: !item.isEnabled });
      await refreshData();
    } catch {
      alert('Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this item from Women\'s Collection?')) return;
    try {
      await api.deleteWomensItem(id);
      await refreshData();
    } catch {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            Women's Collection Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage the featured luxury women's watches displayed on the homepage.
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Women's Watch</span>
        </button>
      </div>

      {/* Add Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                Add Women's Timepiece
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Curren Blanche Pearl & Rose"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Subtitle</label>
                <input
                  type="text"
                  placeholder="Mother-of-pearl dial with diamond hour markers"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="7800"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Original Price</label>
                  <input
                    type="number"
                    placeholder="9500"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="hidden" />
                  </label>
                </div>
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
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase rounded-lg cursor-pointer"
                >
                  Add Timepiece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                Edit Women's Timepiece
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Subtitle</label>
                <input
                  type="text"
                  value={editingItem.subtitle}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Original Price</label>
                  <input
                    type="number"
                    value={editingItem.originalPrice || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {womensItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl overflow-hidden border transition-all ${
              item.isEnabled
                ? 'bg-neutral-900/60 border-neutral-800'
                : 'bg-neutral-950/40 border-neutral-900 opacity-60'
            }`}
          >
            <div className="relative aspect-[4/3] w-full bg-neutral-950">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <button
                onClick={() => handleToggleEnabled(item)}
                className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border cursor-pointer ${
                  item.isEnabled
                    ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/40'
                    : 'bg-neutral-900 text-neutral-500 border-neutral-700'
                }`}
              >
                {item.isEnabled ? 'Active' : 'Disabled'}
              </button>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-display font-semibold text-sm text-neutral-100">{item.title}</h3>
              <p className="text-[11px] text-neutral-400 line-clamp-1">{item.subtitle}</p>
              <div className="text-sm font-bold text-rose-300 tabular-nums">
                Rs. {item.price.toLocaleString()}
              </div>
              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
