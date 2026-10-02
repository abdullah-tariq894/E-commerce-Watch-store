import React from 'react';
import { useStore } from '../../context/StoreContext';

export const ScrollingAnnouncement: React.FC = () => {
  const { settings } = useStore();
  const { scrollingAnnouncement } = settings;

  if (!scrollingAnnouncement?.enabled) return null;

  const duration = scrollingAnnouncement.speed || 25;

  return (
    <div
      style={{
        backgroundColor: scrollingAnnouncement.bgColor || '#14141c',
        color: scrollingAnnouncement.textColor || '#e5e5e5',
      }}
      className="overflow-hidden py-3 border-y border-neutral-800/80 shadow-inner select-none"
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          display: 'inline-flex',
        }}
      >
        <span className="text-xs sm:text-sm font-medium tracking-widest uppercase px-6">
          {scrollingAnnouncement.text}
        </span>
        <span className="text-xs sm:text-sm font-medium tracking-widest uppercase px-6">
          {scrollingAnnouncement.text}
        </span>
        <span className="text-xs sm:text-sm font-medium tracking-widest uppercase px-6">
          {scrollingAnnouncement.text}
        </span>
        <span className="text-xs sm:text-sm font-medium tracking-widest uppercase px-6">
          {scrollingAnnouncement.text}
        </span>
      </div>
    </div>
  );
};
