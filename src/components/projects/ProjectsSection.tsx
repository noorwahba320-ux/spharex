import React, { useState } from 'react';
import { ProjectItem } from '../../types';
import { soundFX } from '../../lib/audio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onOpenProjectModal: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onOpenProjectModal,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'nour-eldein', 'abdelrahman-foda'];

  const filteredProjects =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.memberSlug === filter);

  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
        <div className="text-xs font-mono text-cyan-400">ENGINEERING WORK // VERIFIED REPOSITORIES</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
          المشاريع الهندسية والبرمجية
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          مشاريع حقيقية مبنية ومطورة ومسجلة في المحافظ الشخصية لأعضاء الفريق.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 text-xs font-mono">
        <button
          onClick={() => {
            soundFX.playClick();
            setFilter('All');
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'All' ? 'bg-cyan-400 text-black font-bold' : 'bg-[#0b1016] text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          كافة المشاريع ({projects.length})
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            setFilter('nour-eldein');
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'nour-eldein' ? 'bg-cyan-400 text-black font-bold' : 'bg-[#0b1016] text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          نور الدين وهبة
        </button>
        <button
          onClick={() => {
            soundFX.playClick();
            setFilter('abdelrahman-foda');
          }}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filter === 'abdelrahman-foda' ? 'bg-cyan-400 text-black font-bold' : 'bg-[#0b1016] text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          عبد الرحمن فودة
        </button>
      </div>

      {/* Projects Grid (Typography + Code Icons, Zero Fake Screenshots) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              soundFX.playClick();
              onOpenProjectModal(p);
            }}
            className="p-6 rounded-2xl bg-[#0b1016] border border-white/10 hover:border-cyan-400/50 cursor-pointer flex flex-col justify-between space-y-4 transition-all hover:bg-[#0e151e]"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-cyan-400">{p.category}</span>
                <span className="text-slate-500">
                  {p.memberSlug === 'nour-eldein' ? 'NW' : 'AM'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white font-display">
                {p.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mt-2.5 line-clamp-3">
                {p.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {p.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#141d28] text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <span className="text-xs font-mono text-cyan-400">تفاصيل ←</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#0b1016] rounded-2xl border border-white/15 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <div className="text-xs font-mono text-cyan-400">{project.category}</div>
            <h3 className="text-2xl font-bold text-white font-display mt-0.5">{project.title}</h3>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#141d28] text-slate-400 hover:text-white border border-white/10"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400">الوصف الهندسي للمشروع:</div>
          <p className="text-sm text-slate-200 leading-relaxed bg-[#131b26] p-4 rounded-xl border border-white/5">
            {project.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400">التقنيات المستخدمة:</div>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((t, idx) => (
              <span key={idx} className="px-2.5 py-1 text-xs font-mono bg-[#141d28] rounded border border-white/10 text-cyan-300">
                {t}
              </span>
            ))}
          </div>
        </div>

        {project.githubUrl && (
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold transition-colors"
            >
              مستودع الكود (GitHub) ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
