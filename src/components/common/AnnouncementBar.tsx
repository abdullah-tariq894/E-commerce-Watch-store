import React from 'react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();
  const { topAnnouncement } = settings;

  if (!topAnnouncement?.enabled) return null;

  return (
    <div
      style={{
        backgroundColor: topAnnouncement.bgColor || '#0f0f13',
        color: topAnnouncement.textColor || '#f59e0b',
      }}
      className="py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wider uppercase border-b border-amber-500/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>{topAnnouncement.text}</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      </div>
    </div>
  );
};
