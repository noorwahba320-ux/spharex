import React, { useState } from 'react';
import { soundFX } from '../../lib/audio';

interface TopBarProps {
  onOpenAdmin: () => void;
  onOpenGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  teamName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenAdmin,
  onOpenGame,
  soundEnabled,
  onToggleSound,
  teamName = 'AstraSPHEREx Egypt',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-white/10 bg-[#05070a]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundFX.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-base font-bold tracking-wide text-white font-display flex items-center gap-2 group"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
          <span>{teamName}</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links (anti-slop clean typography) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono text-slate-300">
          <a
            href="#hero"
            onClick={() => soundFX.playClick()}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            الأرض ومصر
          </a>
          <a
            href="#team"
            onClick={() => soundFX.playClick()}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            الفريق
          </a>
          <a
            href="#mission"
            onClick={() => soundFX.playClick()}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            مهمة SPHEREx
          </a>
          <a
            href="#projects"
            onClick={() => soundFX.playClick()}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            المشاريع الموثقة
          </a>
          <a
            href="#lab"
            onClick={() => soundFX.playClick()}
            className="text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            المختبر 3D
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              onToggleSound();
              soundFX.playClick();
            }}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            className="p-2 rounded-lg bg-[#0b1016] hover:bg-[#141b24] text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            {soundEnabled ? (
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onOpenAdmin();
            }}
            className="px-3 py-1.5 rounded-lg bg-[#0b1016] hover:bg-[#141b24] border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-200 transition-colors"
          >
            لوحة الإدارة (CMS)
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0b1016] border border-white/10 text-slate-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#05070a] p-4 space-y-2">
          <a
            href="#hero"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playClick();
            }}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white"
          >
            الأرض ومصر (3D Earth)
          </a>
          <a
            href="#team"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playClick();
            }}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white"
          >
            الفريق الأساسي
          </a>
          <a
            href="#mission"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playClick();
            }}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white"
          >
            مهمة SPHEREx & Planet X
          </a>
          <a
            href="#projects"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playClick();
            }}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white"
          >
            المشاريع الموثقة
          </a>
          <a
            href="#lab"
            onClick={() => {
              setMobileMenuOpen(false);
              soundFX.playClick();
            }}
            className="block px-3 py-2 text-sm text-amber-400"
          >
            المختبر الفضائي 3D
          </a>
        </div>
      )}
    </header>
  );
};
