import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const AnnouncementBarSection: React.FC = () => {
  const { settings, refreshData } = useStore();

  // Top Bar State
  const [topEnabled, setTopEnabled] = useState(settings.topAnnouncement?.enabled ?? true);
  const [topText, setTopText] = useState(
    settings.topAnnouncement?.text || 'FREE DELIVERY ALL OVER KARACHI ON ORDERS ABOVE RS. 10,000'
  );
  const [topBgColor, setTopBgColor] = useState(settings.topAnnouncement?.bgColor || '#0f0f13');
  const [topTextColor, setTopTextColor] = useState(settings.topAnnouncement?.textColor || '#f59e0b');
  const [deliveryThreshold, setDeliveryThreshold] = useState(
    settings.topAnnouncement?.deliveryThreshold || 10000
  );

  // Scrolling Announcement State
  const [scrollEnabled, setScrollEnabled] = useState(settings.scrollingAnnouncement?.enabled ?? true);
  const [scrollText, setScrollText] = useState(
    settings.scrollingAnnouncement?.text ||
      '★ PREMIUM WATCHES ★ 100% ORIGINAL QUALITY ★ FREE DELIVERY OVER RS. 10,000 ★ FAST DISPATCH ACROSS PAKISTAN ★ CONTACT US ON WHATSAPP: 0330-2244486 ★ CASH ON DELIVERY AVAILABLE'
  );
  const [scrollSpeed, setScrollSpeed] = useState(settings.scrollingAnnouncement?.speed || 24);
  const [scrollBgColor, setScrollBgColor] = useState(settings.scrollingAnnouncement?.bgColor || '#14141c');
  const [scrollTextColor, setScrollTextColor] = useState(
    settings.scrollingAnnouncement?.textColor || '#e5e5e5'
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        topAnnouncement: {
          enabled: topEnabled,
          text: topText,
          bgColor: topBgColor,
          textColor: topTextColor,
          deliveryThreshold: Number(deliveryThreshold),
        },
        scrollingAnnouncement: {
          enabled: scrollEnabled,
          text: scrollText,
          speed: Number(scrollSpeed),
          bgColor: scrollBgColor,
          textColor: scrollTextColor,
        },
        delivery: {
          ...settings.delivery,
          karachiFreeThreshold: Number(deliveryThreshold),
        },
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to save announcement bar settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Announcement Bars & Tickers
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Customize header announcement bar and the scrolling marquee following the homepage slider.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Announcements updated and live on storefront!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Top Header Announcement */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200">
              1. Top Announcement Bar (Header Banner)
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={topEnabled}
                onChange={(e) => setTopEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-semibold text-neutral-300 uppercase">Enable Top Bar</span>
            </label>
          </div>

          <div
            style={{ backgroundColor: topBgColor, color: topTextColor }}
            className="p-3 text-center rounded-lg font-semibold tracking-wider uppercase border border-neutral-700/50"
          >
            {topText || 'ANNOUNCEMENT PREVIEW'}
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
              Announcement Text
            </label>
            <input
              type="text"
              required
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={topBgColor}
                  onChange={(e) => setTopBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={topBgColor}
                  onChange={(e) => setTopBgColor(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={topTextColor}
                  onChange={(e) => setTopTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={topTextColor}
                  onChange={(e) => setTopTextColor(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
                Free Delivery Threshold (PKR)
              </label>
              <input
                type="number"
                value={deliveryThreshold}
                onChange={(e) => setDeliveryThreshold(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Scrolling Announcement (Marquee) */}
        <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h2 className="font-display font-bold text-sm uppercase tracking-wider text-neutral-200">
              2. Scrolling Marquee (After Slider)
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={scrollEnabled}
                onChange={(e) => setScrollEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-semibold text-neutral-300 uppercase">Enable Marquee</span>
            </label>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
              Scrolling Marquee Text
            </label>
            <textarea
              rows={2}
              required
              value={scrollText}
              onChange={(e) => setScrollText(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={scrollBgColor}
                  onChange={(e) => setScrollBgColor(e.target.value)}
                  className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={scrollBgColor}
                  onChange={(e) => setScrollBgColor(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={scrollTextColor}
                  onChange={(e) => setScrollTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={scrollTextColor}
                  onChange={(e) => setScrollTextColor(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
                Animation Speed (Seconds)
              </label>
              <input
                type="number"
                min="10"
                max="60"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-200"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Announcements'}
          </button>
        </div>
      </form>
    </div>
  );
};
