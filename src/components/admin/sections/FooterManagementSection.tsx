import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const FooterManagementSection: React.FC = () => {
  const { settings, refreshData } = useStore();
  const [description, setDescription] = useState(settings.footer.description || '');
  const [address, setAddress] = useState(settings.footer.address || '');
  const [phone, setPhone] = useState(settings.footer.phone || '0330-2244486');
  const [email, setEmail] = useState(settings.footer.email || 'perfecttime246@gmail.com');
  const [copyrightText, setCopyrightText] = useState(settings.footer.copyrightText || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        footer: {
          description,
          address,
          phone,
          email,
          copyrightText,
        },
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to update footer information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Footer Management
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Update store description, contact numbers, Gmail address, and copyright text displayed in the footer.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Footer updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Footer Brand Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none"
          />
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Store Physical Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
              WhatsApp Support Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
            />
          </div>
          <div>
            <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
              Gmail Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Copyright Line
          </label>
          <input
            type="text"
            value={copyrightText}
            onChange={(e) => setCopyrightText(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
          />
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Footer'}
          </button>
        </div>
      </form>
    </div>
  );
};
