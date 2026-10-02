import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const WebsiteSettingsSection: React.FC = () => {
  const { settings, refreshData } = useStore();
  const [siteTitle, setSiteTitle] = useState(settings.branding.siteTitle || 'Perfect Time Collection');
  const [siteTagline, setSiteTagline] = useState(settings.branding.siteTagline || 'Master Horology & Luxury Timepieces');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        branding: {
          ...settings.branding,
          siteTitle,
          siteTagline,
        },
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to update website settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Website Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure primary storefront branding, page title, and meta headings.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Website settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Store Brand Title
          </label>
          <input
            type="text"
            required
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Store Tagline / Subtitle
          </label>
          <input
            type="text"
            value={siteTagline}
            onChange={(e) => setSiteTagline(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-neutral-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
