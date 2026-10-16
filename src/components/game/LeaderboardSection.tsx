import React from 'react';
import { LeaderboardEntry } from '../../types';

interface LeaderboardSectionProps {
  entries: LeaderboardEntry[];
  onOpenGame: () => void;
  teamLogoText?: string;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  entries,
  onOpenGame,
  teamLogoText = 'EGYPT · SPHEREx',
}) => {
  return (
    <section id="lab" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* REVEAL CARD ("STILL HERE?") */}
      <div className="rounded-3xl p-8 sm:p-12 bg-[#0b1016] border border-white/10 text-center space-y-6 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono text-cyan-400 bg-[#131b26] rounded-full border border-white/10">
          <span>EXPERIENCE // SIMULATION LAB</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold text-white font-display">
          هل ما زلت هنا؟ <br />
          <span className="text-cyan-400">STILL HERE?</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          ادخل الآن إلى محاكي القيادة ثلاثي الأبعاد المطور بالكامل بلغة Three.js، واختبر التحكم والسرعة وتفادي العوائق في الطريق الفضائي.
        </p>

        <div>
          <button
            onClick={onOpenGame}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-mono text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          >
            <span>ENTER THE TEAM LAB — ادخل المختبر</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          {teamLogoText} // 3D PROCEDURAL RACER
        </div>
      </div>

      {/* REAL LEADERBOARD (NO FAKE DATA) */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#0b1016] border border-white/10">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div>
            <div className="text-xs font-mono text-cyan-400">SCORES & RUNS</div>
            <h3 className="text-lg font-bold text-white font-display">
              لوحة متصدري السباق (Leaderboard)
            </h3>
          </div>
          <button
            onClick={onOpenGame}
            className="px-3.5 py-1.5 text-xs font-mono text-cyan-300 bg-[#131b26] hover:bg-[#1a2533] border border-white/10 rounded-lg transition-colors"
          >
            جرب القيادة الآن
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-slate-500 space-y-1">
            <div className="text-base text-slate-400 font-bold">لا توجد نتائج مسجلة بعد (No scores yet)</div>
            <p>كن أول من يخوض تجربة المحاكاة في المختبر ويسجل رقمه القياسي!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-white/5">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">اسم الطيار</th>
                  <th className="py-2.5 px-3">النقاط</th>
                  <th className="py-2.5 px-3">المسافة</th>
                  <th className="py-2.5 px-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-[#131b26] transition-colors">
                    <td className="py-3 px-3 text-cyan-400 font-bold">0{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-white">{entry.nickname}</td>
                    <td className="py-3 px-3 text-amber-400 tabular-nums">{entry.score}</td>
                    <td className="py-3 px-3 text-slate-300 tabular-nums">{entry.distance} km</td>
                    <td className="py-3 px-3 text-slate-500 tabular-nums">{entry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
