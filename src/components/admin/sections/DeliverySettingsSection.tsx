import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const DeliverySettingsSection: React.FC = () => {
  const { settings, refreshData } = useStore();
  const [karachiThreshold, setKarachiThreshold] = useState(
    settings.delivery.karachiFreeThreshold || 10000
  );
  const [flatFee, setFlatFee] = useState(settings.delivery.flatDeliveryFee || 250);
  const [estimatedDays, setEstimatedDays] = useState(
    settings.delivery.estimatedDays || '2 - 4 Business Days'
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        delivery: {
          karachiFreeThreshold: Number(karachiThreshold),
          flatDeliveryFee: Number(flatFee),
          estimatedDays,
        },
        topAnnouncement: {
          ...settings.topAnnouncement,
          deliveryThreshold: Number(karachiThreshold),
        },
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to update delivery settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Delivery & Shipping Rules
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure Karachi free delivery rules, flat standard courier charges, and dispatch timelines.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Delivery rules updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Karachi Free Delivery Minimum Amount (PKR) <span className="text-amber-500">*</span>
          </label>
          <input
            type="number"
            required
            value={karachiThreshold}
            onChange={(e) => setKarachiThreshold(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 text-sm focus:border-amber-500 focus:outline-none"
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            Orders equal to or above this amount automatically receive <strong>Rs. 0 Delivery</strong>.
          </p>
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Standard Flat Delivery Fee (PKR) <span className="text-amber-500">*</span>
          </label>
          <input
            type="number"
            required
            value={flatFee}
            onChange={(e) => setFlatFee(Number(e.target.value))}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 text-sm focus:border-amber-500 focus:outline-none"
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            Applied to customer orders below the free delivery threshold.
          </p>
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Estimated Delivery Timeline Notice
          </label>
          <input
            type="text"
            value={estimatedDays}
            onChange={(e) => setEstimatedDays(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 text-sm focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Delivery Rules'}
          </button>
        </div>
      </form>
    </div>
  );
};
