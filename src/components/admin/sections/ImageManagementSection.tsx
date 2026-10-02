import React, { useState } from 'react';
import { Upload, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const ImageManagementSection: React.FC = () => {
  const { products, slides, womensItems, categories } = useStore();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Collect all unique images referenced across the store
  const allImages = Array.from(
    new Set([
      ...slides.map((s) => s.image),
      ...womensItems.map((w) => w.image),
      ...categories.map((c) => c.image),
      ...products.flatMap((p) => p.images),
      ...uploadedImages,
    ])
  ).filter(Boolean);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const res = await api.uploadImage(file);
      setUploadedImages((prev) => [res.url, ...prev]);
    } catch {
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Media & Image Library
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Upload and manage photos for products, slides, categories, and banners with copyable URLs.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
        <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors">
          <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <label className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer">
            <span>Click to upload new watch photograph</span>
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          <p className="text-[11px] text-neutral-500 mt-1">
            Accepts JPG, PNG, WEBP up to 10MB. Stored in server upload repository.
          </p>
          {uploading && <p className="text-xs text-amber-400 mt-2 font-semibold">Uploading photo...</p>}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Active Media Assets ({allImages.length})</span>
          </h2>
          <span className="text-[11px] text-neutral-500">Click any image to copy its URL path</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allImages.map((url, idx) => (
            <div
              key={idx}
              className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/60 transition-all flex flex-col"
            >
              <div className="aspect-square w-full overflow-hidden bg-neutral-950">
                <img src={url} alt={`media-${idx}`} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
                <button
                  onClick={() => copyUrl(url)}
                  className="flex-1 text-[10px] text-amber-400 hover:underline truncate text-left flex items-center gap-1 font-mono cursor-pointer"
                  title="Copy URL"
                >
                  {copiedUrl === url ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
