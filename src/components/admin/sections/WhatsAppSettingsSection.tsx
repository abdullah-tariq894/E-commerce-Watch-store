import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const WhatsAppSettingsSection: React.FC = () => {
  const { settings, refreshData } = useStore();
  const [number, setNumber] = useState(settings.whatsapp.number || '0330-2244486');
  const [buttonText, setButtonText] = useState(settings.whatsapp.buttonText || 'Chat on WhatsApp');
  const [welcomeMessage, setWelcomeMessage] = useState(
    settings.whatsapp.welcomeMessage || 'Hello! I am interested in exploring your luxury watch collection.'
  );
  const [isFloatingEnabled, setIsFloatingEnabled] = useState(
    settings.whatsapp.isFloatingEnabled ?? true
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let cleanNum = number.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('0')) {
      cleanNum = '92' + cleanNum.slice(1);
    }
    try {
      await api.updateSettings({
        whatsapp: {
          number,
          formattedNumber: cleanNum,
          buttonText,
          welcomeMessage,
          isFloatingEnabled,
        },
        footer: {
          ...settings.footer,
          phone: number,
        },
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to update WhatsApp settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          WhatsApp Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure store owner's WhatsApp number for customer orders and the floating chat button.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>WhatsApp settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-5 text-xs">
        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Owner WhatsApp Number <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="0330-2244486"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 text-sm focus:border-amber-500 focus:outline-none"
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            Current configured owner WhatsApp: <strong>{number}</strong>
          </p>
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Floating Button Text
          </label>
          <input
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
          />
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Default Greeting Message
          </label>
          <textarea
            rows={3}
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none"
          />
        </div>

        <div className="pt-2 border-t border-neutral-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFloatingEnabled}
              onChange={(e) => setIsFloatingEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="font-semibold text-neutral-200 uppercase block">
                Enable Sticky Floating WhatsApp Button
              </span>
              <span className="text-neutral-500 text-[11px]">
                Displays the fixed green "Chat on WhatsApp" widget on bottom-right of all storefront pages.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save WhatsApp Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
