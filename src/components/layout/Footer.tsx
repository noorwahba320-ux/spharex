import React from 'react';

interface FooterProps {
  footerText?: string;
  onOpenAdmin: () => void;
  onOpenGame: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  footerText = 'فريق مصري مشارك في NASA Space Apps Challenge 2026',
  onOpenAdmin,
  onOpenGame,
}) => {
  return (
    <footer className="relative border-t border-white/10 bg-[#05070a] py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
        <div className="space-y-1">
          <div className="font-bold text-white font-display text-sm tracking-wide flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>AstraSPHEREx Egypt // Team Hub</span>
          </div>
          <p className="text-slate-500">{footerText}</p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onOpenGame}
            className="hover:text-amber-400 transition-colors"
          >
            المختبر 3D
          </button>
          <button
            onClick={onOpenAdmin}
            className="hover:text-cyan-400 transition-colors"
          >
            لوحة الإدارة
          </button>
          <a
            href="https://www.spaceappschallenge.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            NASA Space Apps 2026 ↗
          </a>
        </div>
      </div>
    </footer>
  );
};
