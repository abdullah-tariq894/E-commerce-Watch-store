import React, { useState } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';
import { StockStatus } from '../../../types';

interface AddProductSectionProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddProductSection: React.FC<AddProductSectionProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { categories, refreshData } = useStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Edifice');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('IN_STOCK');
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Specifications
  const [caseDiameter, setCaseDiameter] = useState('42 mm');
  const [strapMaterial, setStrapMaterial] = useState('Stainless Steel Bracelet');
  const [waterResistance, setWaterResistance] = useState('100m');
  const [movementType, setMovementType] = useState('Japanese Quartz Movement');
  const [warranty, setWarranty] = useState('1 Year Official Warranty');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const result = await api.uploadImage(file);
      setImages((prev) => [...prev, result.url]);
    } catch {
      alert('Upload failed. Please check image format.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddUrlImage = () => {
    if (customImageUrl.trim()) {
      setImages((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product name is required.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMessage('Valid product price is required.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Product description is required.');
      return;
    }

    const finalImages =
      images.length > 0
        ? images
        : ['/src/assets/images/hero_luxury_watch_slider_1_1790915310932.jpg'];

    setSubmitting(true);
    try {
      await api.addProduct({
        name,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        description,
        images: finalImages,
        stockStatus,
        isFeatured,
        specs: {
          caseDiameter,
          strapMaterial,
          waterResistance,
          movementType,
          warranty,
        },
      });
      await refreshData();
      setSuccessMessage('Watch successfully published and added to category!');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
            Add New Watch
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Complete the form below to publish a new timepiece directly to your online storefront.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg border border-neutral-700 cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3">
            1. Core Details
          </h2>
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Watch Model Name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Casio Edifice ECB-900DB Bluetooth Chronograph"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Brand / Category <span className="text-amber-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Selling Price (PKR) <span className="text-amber-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 24900"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Original Cut Price (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 29500"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Description <span className="text-amber-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Highlight watch materials, dial craftsmanship, bezel finish, and horology specifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* Product Availability & Status */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3">
            2. Availability Status & Promotion
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Product Availability Status <span className="text-amber-500">*</span>
              </label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="IN_STOCK">● IN STOCK (Active & Orderable)</option>
                <option value="OUT_OF_STOCK">● OUT OF STOCK (Visible, cannot order)</option>
                <option value="OFF">● OFF (Completely hidden from public)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Mark as Featured Product on Homepage
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Images Management */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3">
            3. Multiple Product Images
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-neutral-700/80 rounded-xl p-5 text-center flex flex-col items-center justify-center hover:border-amber-500/50 transition-colors">
              <Upload className="w-6 h-6 text-neutral-400 mb-2" />
              <label className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer">
                <span>Upload image from computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-neutral-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
              {uploading && <p className="text-xs text-amber-400 mt-2">Uploading...</p>}
            </div>

            <div className="flex flex-col justify-center space-y-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Or Add Image URL Path
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="/src/assets/images/... or web URL"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500"
                />
                <button
                  type="button"
                  onClick={handleAddUrlImage}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Image Previews ({images.length}):
              </span>
              <div className="flex flex-wrap gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 group"
                  >
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-neutral-950/80 hover:bg-red-500 text-neutral-300 hover:text-white rounded-full transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-neutral-950 text-[9px] font-bold text-center uppercase">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Technical Specifications */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200 border-b border-neutral-800 pb-3">
            4. Technical Specifications (Horology Attributes)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Case Diameter</label>
              <input
                type="text"
                value={caseDiameter}
                onChange={(e) => setCaseDiameter(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Strap / Bracelet</label>
              <input
                type="text"
                value={strapMaterial}
                onChange={(e) => setStrapMaterial(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Water Resistance</label>
              <input
                type="text"
                value={waterResistance}
                onChange={(e) => setWaterResistance(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Movement Type</label>
              <input
                type="text"
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-semibold mb-1">Warranty Period</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
              />
            </div>
          </div>
        </div>

        {/* Form CTA Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'SAVING TO DATABASE...' : 'PUBLISH WATCH TO STORE'}
          </button>
        </div>
      </form>
    </div>
  );
};
