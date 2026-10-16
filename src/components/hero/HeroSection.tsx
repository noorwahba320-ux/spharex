import React from 'react';
import { EarthCanvas } from '../3d/EarthCanvas';
import { soundFX } from '../../lib/audio';
import { SiteSettings } from '../../types';

interface HeroSectionProps {
  settings: SiteSettings;
  onNext: () => void;
  onEgyptFocused?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onNext,
  onEgyptFocused,
}) => {
  const triggerEgyptFocus = () => {
    soundFX.playClick();
    window.dispatchEvent(new CustomEvent('focus-egypt-earth'));
  };

  return (
    <section id="hero" className="relative min-h-screen pt-20 flex flex-col justify-between overflow-hidden bg-[#05070a]">
      {/* Editorial Header */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#0b1016] border border-white/10 text-slate-300 pointer-events-auto">
          <span>{settings.challengeTitle}</span>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400">{settings.challengeTrack}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white font-display tracking-tight leading-tight">
          {settings.heroHeadline}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {settings.heroSubheadline}
        </p>
      </div>

      {/* 3D EARTH (PURE PROCEDURAL THREE.JS CANVAS - ZERO DECORATIVE OVERLAYS) */}
      <div className="relative w-full flex-1 min-h-[460px] lg:min-h-[580px] my-1">
        <EarthCanvas
          accentColor={settings.accentColor}
          enableSound={true}
          onEgyptFocused={onEgyptFocused}
        />
      </div>

      {/* Scientific Action Bar (Integrated cleanly below canvas) */}
      <div className="relative z-20 pb-8 px-4 max-w-lg mx-auto text-center space-y-3 font-mono">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={triggerEgyptFocus}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono text-slate-300 bg-[#0b1016] hover:bg-[#141d28] border border-white/10 hover:border-amber-400/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>تركيز الكاميرا على مصر (26°49'N · 30°48'E)</span>
          </button>

          <button
            onClick={() => {
              soundFX.playWarp();
              onNext();
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-mono font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)]"
          >
            <span>استكشف الفريق (NEXT)</span>
            <span aria-hidden="true">←</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500">
          انقر واسحب للتدوير بالماوس أو اللمس · نقر مزدوج للتركيز على مصر
        </div>
      </div>
    </section>
  );
};
