import React, { useState } from 'react';
import { Member, ProjectItem } from '../../types';
import { soundFX } from '../../lib/audio';

interface MemberProfileProps {
  member: Member;
  allProjects: ProjectItem[];
  onClose: () => void;
  onOpenProjectModal: (project: ProjectItem) => void;
}

export const MemberProfile: React.FC<MemberProfileProps> = ({
  member,
  allProjects,
  onClose,
  onOpenProjectModal,
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'projects' | 'timeline' | 'special'>('about');

  const memberProjects = allProjects.filter((p) => p.memberSlug === member.slug);

  // Group skills by category
  const categories = Array.from(new Set(member.skills.map((s) => s.category)));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b1016] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-mono transition-colors"
          >
            <span>→ العودة للفريق</span>
          </button>

          <span className="text-xs font-mono text-cyan-400">
            TECHNICAL DOSSIER // {member.name.toUpperCase()}
          </span>

          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#0b1016] text-slate-400 hover:text-white border border-white/10"
          >
            ✕
          </button>
        </div>

        {/* Member Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0b1016] border border-white/10 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
            {/* Monogram Initials */}
            <div className="w-20 h-20 shrink-0 rounded-2xl bg-[#141d28] border border-cyan-400/40 flex items-center justify-center text-2xl font-mono font-bold text-cyan-300 shadow-md">
              {member.initials}
            </div>

            <div className="space-y-1.5 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {member.arabicName}
              </h1>
              <div className="text-xs font-mono text-cyan-400 font-semibold">{member.name}</div>
              <div className="text-xs font-mono text-slate-300">{member.role}</div>
              <div className="text-xs text-slate-500 font-mono pt-1">
                {member.education}
              </div>

              {/* Verified Contact info (Only shown if toggled in CMS) */}
              {member.showContact && (
                <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-[#131b26] border border-white/10 text-xs font-mono text-slate-300 hover:text-white"
                    >
                      GitHub Profile ↗
                    </a>
                  )}
                  {member.websiteUrl && (
                    <a
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-[#131b26] border border-white/10 text-xs font-mono text-slate-300 hover:text-white"
                    >
                      Portfolio Site ↗
                    </a>
                  )}
                  {member.telegramUrl && (
                    <a
                      href={member.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-[#131b26] border border-white/10 text-xs font-mono text-slate-300 hover:text-white"
                    >
                      Telegram Channel ↗
                    </a>
                  )}
                  {member.email && (
                    <span className="text-xs font-mono text-slate-400 px-2 py-1">
                      {member.email}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'about' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            النبذة والمسار
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'skills' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            المهارات والتقنيات ({member.skills.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'projects' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            المشاريع الموثقة ({memberProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'timeline' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            المسار الزمني (Timeline)
          </button>
          {member.apis && member.apis.length > 0 && (
            <button
              onClick={() => setActiveTab('special')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'special' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              الواجهات البرمجية (APIs)
            </button>
          )}
          {member.achievements && member.achievements.length > 0 && !member.apis && (
            <button
              onClick={() => setActiveTab('special')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'special' ? 'bg-cyan-400 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              الإنجازات والمسابقات
            </button>
          )}
        </div>

        {/* TAB: ABOUT */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0b1016] border border-white/10 space-y-3">
              <h3 className="text-sm font-bold font-mono text-cyan-400">النبذة المهنية الموثقة</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {member.fullBio}
              </p>
            </div>

            {member.achievements && member.achievements.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0b1016] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold font-mono text-cyan-400">الإنجازات والمسابقات الرسمية</h3>
                <div className="space-y-3">
                  {member.achievements.map((ach) => (
                    <div key={ach.id} className="p-3 rounded-xl bg-[#131b26] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                      <span className="font-bold text-white">{ach.title}</span>
                      <span className="text-amber-400">{ach.placement || ach.organization}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: SKILLS (CLEAN UNBOXED & CATEGORIZED, NO FAKE NUMBERS) */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat} className="p-5 rounded-2xl bg-[#0b1016] border border-white/10 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400">{cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <span
                        key={s.id}
                        className="px-3 py-1 rounded-lg bg-[#131b26] border border-white/10 text-xs font-mono text-slate-200"
                      >
                        {s.name}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  soundFX.playClick();
                  onOpenProjectModal(p);
                }}
                className="p-5 rounded-2xl bg-[#0b1016] border border-white/10 hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between space-y-4 transition-colors"
              >
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-cyan-400">{p.category}</div>
                  <h4 className="text-base font-bold text-white font-display">{p.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono bg-[#141d28] px-1.5 py-0.5 rounded text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-cyan-400">عرض ←</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="p-6 rounded-2xl bg-[#0b1016] border border-white/10 space-y-6">
            <h3 className="text-sm font-bold font-mono text-cyan-400">المسار الزمني الموثق</h3>
            <div className="border-r border-white/15 pr-4 space-y-6 mr-1 font-mono text-xs">
              {member.timeline.map((item) => (
                <div key={item.id} className="relative">
                  <div className="text-amber-400 font-bold">{item.year}</div>
                  <div className="text-white font-bold text-sm mt-0.5">{item.title}</div>
                  <p className="text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: APIS (For Nour Eldein) */}
        {activeTab === 'special' && member.apis && (
          <div className="space-y-3">
            {member.apis.map((api) => (
              <div key={api.id} className="p-4 rounded-xl bg-[#0b1016] border border-white/10 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {api.method}
                    </span>
                    <span className="font-bold text-white">{api.name}</span>
                    <span className="text-slate-500">· {api.category}</span>
                  </div>
                  <div className="text-slate-400 mt-1">{api.description}</div>
                  {api.params && <div className="text-[11px] text-amber-400 mt-0.5">Params: {api.params}</div>}
                </div>
                <a
                  href={api.endpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#141d28] hover:bg-[#1b2636] border border-white/10 text-cyan-300 text-center whitespace-nowrap"
                >
                  فتح الـ API ↗
                </a>
              </div>
            ))}
          </div>
        )}

        {/* TAB: ACHIEVEMENTS (For Abdelrahman) */}
        {activeTab === 'special' && !member.apis && (
          <div className="space-y-3">
            {member.achievements.map((ach) => (
              <div key={ach.id} className="p-4 rounded-xl bg-[#0b1016] border border-white/10 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{ach.title}</span>
                  <span className="text-slate-400">{ach.year}</span>
                </div>
                <div className="text-amber-400">{ach.placement}</div>
                <div className="text-slate-500">{ach.organization}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
