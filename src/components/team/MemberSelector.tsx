import React from 'react';
import { Member } from '../../types';
import { soundFX } from '../../lib/audio';

interface MemberSelectorProps {
  members: Member[];
  onSelectMember: (slug: string) => void;
  selectedMemberSlug: string | null;
}

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  members,
  onSelectMember,
  selectedMemberSlug,
}) => {
  return (
    <section id="team" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-2 mb-12">
        <div className="text-xs font-mono text-cyan-400">CORE TEAM // NASA SPACE APPS</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
          أعضاء الفريق الأساسي
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          بيانات حقيقية مستخرجة مباشرة من المواقع والملفات الشخصية الرسمية للمطورين.
        </p>
      </div>

      {/* TWO REAL MEMBERS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {members.map((member) => {
          const isSelected = selectedMemberSlug === member.slug;

          return (
            <div
              key={member.id}
              onClick={() => {
                soundFX.playClick();
                onSelectMember(member.slug);
              }}
              className={`p-6 sm:p-8 rounded-2xl bg-[#0b1016] border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.2)]'
                  : 'border-white/10 hover:border-white/25 hover:bg-[#0e151e]'
              }`}
            >
              <div>
                {/* Monogram Badge (NO AI Images!) */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#141d28] border border-white/10 flex items-center justify-center font-mono font-bold text-lg text-cyan-300">
                    {member.initials}
                  </div>
                  <span className="text-xs font-mono text-slate-500">VERIFIED OPERATIVE</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-display">
                    {member.arabicName}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 font-semibold">{member.name}</div>
                  <div className="text-xs text-slate-300 font-mono mt-1">{member.role}</div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mt-4">
                  {member.shortBio}
                </p>

                {/* Verified Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {member.skills.slice(0, 4).map((sk) => (
                    <span
                      key={sk.id}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#131b26] border border-white/5 text-slate-300"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>عرض الملف التقني الكامل</span>
                <span>←</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
