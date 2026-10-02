import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { slides, setCurrentView, navigateToCategory } = useStore();
  const activeSlides = slides.filter((s) => s.isEnabled);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotation
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  const handleActionClick = (link: string) => {
    if (!link) {
      setCurrentView('all-watches');
      return;
    }
    if (link.startsWith('/category/')) {
      const slug = link.replace('/category/', '');
      navigateToCategory(slug);
    } else if (link === '/all-watches') {
      setCurrentView('all-watches');
    } else if (link === '/womens') {
      setCurrentView('womens');
    } else {
      setCurrentView('all-watches');
    }
  };

  return (
    <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[660px] overflow-hidden bg-neutral-950 select-none">
      {/* Background Image with Smooth Crossfade */}
      {activeSlides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
          />
          {/* Measured luxury scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/40 to-neutral-950/80" />
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900/80 border border-amber-500/30 rounded-full text-[11px] font-semibold tracking-widest text-amber-400 uppercase backdrop-blur-sm">
            <span>Exclusive Master Horology</span>
          </div>

          <h2
            key={currentSlide.id + '-title'}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-100 tracking-tight leading-[1.1] uppercase animate-fade-in"
          >
            {currentSlide.title}
          </h2>

          {currentSlide.subtitle && (
            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xl">
              {currentSlide.subtitle}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleActionClick(currentSlide.buttonLink)}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-md shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{currentSlide.buttonText || 'EXPLORE COLLECTION'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('all-watches')}
              className="inline-flex items-center px-6 py-3 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 font-semibold text-xs uppercase tracking-widest rounded-md backdrop-blur-sm transition-colors cursor-pointer"
            >
              VIEW ALL WATCHES
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {activeSlides.length > 1 && (
          <div className="absolute right-4 sm:right-8 bottom-16 sm:bottom-20 z-30 flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
              }
              className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 border border-neutral-700 transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
              className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 border border-neutral-700 transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Pagination Dots */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
