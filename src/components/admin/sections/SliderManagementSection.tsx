import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { Slide } from '../../../types';

export const SliderManagementSection: React.FC = () => {
  const { slides, refreshData } = useStore();
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploading, setUploading] = useState(false);

  // New slide form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newImage, setNewImage] = useState('/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg');
  const [newButtonText, setNewButtonText] = useState('SHOP COLLECTION');
  const [newButtonLink, setNewButtonLink] = useState('/all-watches');
  const [newIsEnabled, setNewIsEnabled] = useState(true);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const res = await api.uploadImage(file);
      if (isEdit && editingSlide) {
        setEditingSlide({ ...editingSlide, image: res.url });
      } else {
        setNewImage(res.url);
      }
    } catch {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImage) {
      alert('Title and Image are required.');
      return;
    }
    try {
      await api.addSlide({
        title: newTitle,
        subtitle: newSubtitle,
        image: newImage,
        buttonText: newButtonText,
        buttonLink: newButtonLink,
        isEnabled: newIsEnabled,
      });
      await refreshData();
      setIsAddingNew(false);
      setNewTitle('');
      setNewSubtitle('');
    } catch {
      alert('Failed to add slide');
    }
  };

  const handleUpdateSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    try {
      await api.updateSlide(editingSlide.id, editingSlide);
      await refreshData();
      setEditingSlide(null);
    } catch {
      alert('Failed to update slide');
    }
  };

  const handleToggleEnabled = async (slide: Slide) => {
    try {
      await api.updateSlide(slide.id, { isEnabled: !slide.isEnabled });
      await refreshData();
    } catch {
      alert('Failed to toggle slide');
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await api.deleteSlide(id);
      await refreshData();
    } catch {
      alert('Failed to delete slide');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            Homepage Hero Slider
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage full-width carousel slides, banners, headlines, and call-to-action buttons.
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Add New Slide Form Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                Add New Slide
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-neutral-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSlide} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Slide Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. THE ART OF MASTER HOROLOGY"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Subtitle / Description</label>
                <textarea
                  rows={2}
                  placeholder="Discover genuine luxury chronographs..."
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Slide Image</label>
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
                {newImage && (
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img src={newImage} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Button Text</label>
                  <input
                    type="text"
                    value={newButtonText}
                    onChange={(e) => setNewButtonText(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Button Link</label>
                  <input
                    type="text"
                    value={newButtonLink}
                    onChange={(e) => setNewButtonLink(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
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
                  Add Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                Edit Slide
              </h3>
              <button onClick={() => setEditingSlide(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateSlide} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Slide Title</label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Subtitle</label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitle}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 uppercase">Image</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    value={editingSlide.image}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                    className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, true)} className="hidden" />
                  </label>
                </div>
                {editingSlide.image && (
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img src={editingSlide.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Button Text</label>
                  <input
                    type="text"
                    value={editingSlide.buttonText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, buttonText: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1 uppercase">Button Link</label>
                  <input
                    type="text"
                    value={editingSlide.buttonLink}
                    onChange={(e) => setEditingSlide({ ...editingSlide, buttonLink: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
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

      {/* Existing Slides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`rounded-2xl overflow-hidden border transition-all ${
              slide.isEnabled
                ? 'bg-neutral-900/60 border-neutral-800'
                : 'bg-neutral-950/40 border-neutral-900 opacity-60'
            }`}
          >
            <div className="relative h-44 w-full bg-neutral-950">
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => handleToggleEnabled(slide)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border cursor-pointer ${
                    slide.isEnabled
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/40'
                      : 'bg-neutral-900 text-neutral-500 border-neutral-700'
                  }`}
                >
                  {slide.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="font-display font-bold text-base text-neutral-100 uppercase">
                {slide.title}
              </h3>
              {slide.subtitle && (
                <p className="text-xs text-neutral-400 line-clamp-2">{slide.subtitle}</p>
              )}
              <div className="text-[11px] text-amber-500 font-mono">
                Button: "{slide.buttonText}" &rarr; {slide.buttonLink}
              </div>
              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  onClick={() => setEditingSlide(slide)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
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
