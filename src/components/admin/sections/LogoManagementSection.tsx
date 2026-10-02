import React, { useState } from 'react';
import { Upload, Check, Trash2 } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const LogoManagementSection: React.FC = () => {
  const { settings, refreshData } = useStore();
  const [logoUrl, setLogoUrl] = useState(settings.branding.logoUrl || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const result = await api.uploadImage(file);
      setLogoUrl(result.url);
    } catch {
      alert('Failed to upload logo image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        branding: {
          ...settings.branding,
          logoUrl,
        },
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to save logo settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLogoUrl('');
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Logo Management
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Upload custom storefront logo or maintain the default luxury emblem.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Logo updated successfully!</span>
        </div>
      )}

      {/* Current Preview */}
      <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4">
        <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
          Current Store Logo Preview
        </h2>
        <div className="p-8 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-center min-h-28">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo Preview" className="h-16 w-auto object-contain max-w-xs" />
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center">
                  <span className="text-amber-400 font-serif font-bold text-lg">P</span>
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-wider text-neutral-100 uppercase block">
                  PERFECT TIME
                </span>
                <span className="text-[10px] tracking-[0.25em] text-amber-500 font-medium block uppercase -mt-0.5">
                  COLLECTION
                </span>
              </div>
            </div>
          )}
        </div>
        <p className="text-[11px] text-neutral-500">
          {logoUrl
            ? 'Custom uploaded logo active.'
            : 'Default gold/champagne horology emblem active.'}
        </p>
      </div>

      {/* Upload and Edit Form */}
      <form onSubmit={handleSave} className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-5 text-xs">
        <div className="border-2 border-dashed border-neutral-700 rounded-xl p-6 text-center hover:border-amber-500/50 transition-colors">
          <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <label className="text-xs font-semibold text-amber-400 hover:underline cursor-pointer">
            <span>Upload New Logo File</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <p className="text-[11px] text-neutral-500 mt-1">PNG, JPG, SVG or WEBP with transparent background</p>
          {uploading && <p className="text-xs text-amber-400 mt-2">Uploading...</p>}
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Or Paste Direct Logo Image URL
          </label>
          <input
            type="text"
            placeholder="/uploads/... or https://..."
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
          />
        </div>

        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset to Default Emblem</span>
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Logo'}
          </button>
        </div>
      </form>
    </div>
  );
};
