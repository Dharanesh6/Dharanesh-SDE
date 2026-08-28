import { useState, useEffect } from 'react';
import {
  Cpu,
  Flame,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import type { ProjectItem } from '../types/portfolio';
import { ProjectModal } from './ProjectModal';

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Handle browser back button (popstate) so it closes modal instead of exiting website
  useEffect(() => {
    const handlePopState = () => {
      setSelectedProject(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openProject = (p: ProjectItem) => {
    setSelectedProject(p);
    try {
      window.history.pushState({ modal: 'project', id: p.id }, '', `#project-${p.id}`);
    } catch {}
  };

  const closeProject = () => {
    setSelectedProject(null);
    if (window.location.hash.startsWith('#project-')) {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {}
    }
  };

  const flagshipProject = PROJECTS.find((p) => p.isFlagship);
  
  // Core major built systems (Digital Campus Help Desk, Novel Nest, SRPTC Admission, SRPTC Web Admin)
  const coreProjects = PROJECTS.filter((p) => !p.isFlagship && p.featuredOrder <= 5);
  
  // Specialized AI/CV & Lab Prototypes (Last 4 extra projects in compact small boxes)
  const extraProjects = PROJECTS.filter((p) => !p.isFlagship && p.featuredOrder > 5);

  const filteredCoreProjects = coreProjects.filter((p) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'ai' && (p.techStack.some((t) => t.includes('AI') || t.includes('NLP')) || p.category.includes('AI'))) return true;
    if (filterCategory === 'web' && (p.techStack.includes('PHP') || p.techStack.includes('WordPress') || p.category.includes('Web'))) return true;
    if (filterCategory === 'automation' && (p.category.includes('Automation') || p.category.includes('Production'))) return true;
    return true;
  });

  return (
    <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-blue/10 border border-brand-blue/20 text-brand-blue-glow light:text-brand-blue font-mono text-xs uppercase tracking-wider mb-2.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>05 // FEATURED ENGINEERING</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            Major Systems & Flagship Projects
          </h2>
          <p className="mt-2 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-xl">
            Real deployed systems with live cloud links across IoT telematics, conversational AI, and web platforms.
          </p>
        </div>

        {/* 1. FLAGSHIP PROJECT CASE STUDY CARD */}
        {flagshipProject && (
          <div className="mb-10">
            <div className="card-cyber p-5 sm:p-8 border-brand-blue/40 relative overflow-hidden bg-gradient-to-br from-dark-surface/90 via-dark-card/90 to-brand-blue/10 light:from-white light:to-slate-50">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan" />

              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    FLAGSHIP PROJECT
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                    ESP32 + Telematics + Cloud
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 light:text-slate-500">
                  Role: <strong className="text-white light:text-slate-800">Team Lead & Main Developer</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white light:text-slate-900 tracking-tight">
                    {flagshipProject.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-brand-cyan">
                    SafeGuard: Automated Accident Severity Classification, SOS Dispatch & InsurTech Claim Sync
                  </p>

                  <p className="mt-3 text-slate-300 light:text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {flagshipProject.summary}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 light:text-slate-700 bg-dark-bg/60 light:bg-slate-100 p-2 rounded-lg border border-white/5 light:border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">MQ-3 Sobriety Ignition Lock</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 light:text-slate-700 bg-dark-bg/60 light:bg-slate-100 p-2 rounded-lg border border-white/5 light:border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                      <span className="truncate">MPU6050 6-Axis Crash G-Force</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 light:text-slate-700 bg-dark-bg/60 light:bg-slate-100 p-2 rounded-lg border border-white/5 light:border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-violet shrink-0" />
                      <span className="truncate">NEO-6M + SIM800L SOS SMS</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 light:text-slate-700 bg-dark-bg/60 light:bg-slate-100 p-2 rounded-lg border border-white/5 light:border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
                      <span className="truncate">Firebase InsurTech Log</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    {flagshipProject.demoUrl && (
                      <a
                        href={flagshipProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                        <span>Live Cloud Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      onClick={() => openProject(flagshipProject)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-slate-200 light:text-slate-800 bg-dark-card light:bg-white hover:bg-dark-card-hover border border-brand-blue/30 transition-all cursor-pointer"
                    >
                      <span>Architecture Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Telemetry Preview Box */}
                <div className="lg:col-span-5 bg-dark-bg/90 light:bg-slate-900 text-slate-200 p-4 rounded-xl border border-brand-blue/30 font-mono text-xs shadow-lg">
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span className="ml-1 text-slate-300 text-[11px]">SafeGuard_Telemetry.ino</span>
                    </div>
                    <a
                      href={flagshipProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 text-[10px] hover:underline flex items-center gap-1"
                    >
                      LIVE CLOUD <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="space-y-1.5 mt-3 text-[11px]">
                    <p className="text-slate-400">// Hardware I2C / UART Bus</p>
                    <p className="text-cyan-300">MPU6050 <span className="text-slate-400">→ SDA: GPIO21, SCL: GPIO22</span></p>
                    <p className="text-violet-300">NEO-6M GPS <span className="text-slate-400">→ UART1 RX: GPIO16</span></p>
                    <p className="text-amber-300">SIM800L GSM <span className="text-slate-400">→ UART2 AT Commands</span></p>
                    <p className="text-emerald-300">MQ-3 Alcohol <span className="text-slate-400">→ Safe BAC [Ignition: ON]</span></p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-slate-400 text-[10px]">
                      <span>Host: safeguard-83dfc.web.app</span>
                      <span className="text-brand-cyan">Latency: &lt;5s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CORE MAJOR SYSTEMS GRID */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="font-display font-semibold text-lg text-white light:text-slate-900">
              Core Engineered Systems ({filteredCoreProjects.length})
            </h3>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'ai', label: 'AI & NLP' },
                { id: 'web', label: 'Web' },
                { id: 'automation', label: 'Automation' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterCategory(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    filterCategory === tab.id
                      ? 'bg-brand-blue text-white font-medium'
                      : 'bg-dark-card light:bg-white text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 border border-white/5 light:border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCoreProjects.map((project) => (
              <div
                key={project.id}
                className="card-cyber p-5 flex flex-col justify-between group hover:border-brand-blue/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-blue/10 text-brand-cyan border border-brand-blue/20">
                      {project.category}
                    </span>
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 hover:bg-emerald-500/30"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Live Demo <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">
                        {project.role}
                      </span>
                    )}
                  </div>

                  <h4
                    onClick={() => openProject(project)}
                    className="font-display font-bold text-base sm:text-lg text-white light:text-slate-900 group-hover:text-brand-cyan transition-colors cursor-pointer"
                  >
                    {project.title}
                  </h4>
                  <p className="text-[11px] font-mono text-brand-blue-glow light:text-brand-blue mt-0.5">
                    {project.subtitle}
                  </p>

                  <p className="mt-2 text-xs text-slate-300 light:text-slate-600 leading-relaxed line-clamp-2">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 light:border-slate-200">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.techStack.slice(0, 4).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.2 rounded bg-dark-bg/80 light:bg-slate-100 text-[10px] font-mono text-slate-300 light:text-slate-700 border border-white/5 light:border-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-1.5 py-0.2 rounded bg-white/5 text-[10px] font-mono text-slate-400">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => openProject(project)}
                      className="flex items-center gap-1 text-xs font-mono text-brand-cyan hover:underline cursor-pointer"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        <span>Live App</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. EXTRA / SPECIALIZED AI & CV SYSTEMS (COMPACT SMALL BOXES) */}
        {extraProjects.length > 0 && (
          <div className="p-5 sm:p-6 rounded-2xl bg-dark-surface/50 light:bg-slate-100/60 border border-white/10 light:border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-brand-violet/20 text-brand-violet-glow">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-white light:text-slate-900">
                    Specialized AI / CV Prototypes & Lab Systems
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Extra touchless HMI, deep learning & spatial vision applications ({extraProjects.length} Systems)
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/10 text-brand-violet-glow border border-brand-violet/30">
                Extra Modular Box
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {extraProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => openProject(project)}
                  className="p-3.5 rounded-xl bg-dark-bg/80 light:bg-white border border-white/5 light:border-slate-200 hover:border-brand-violet/50 transition-all flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand-violet/15 text-brand-violet-glow">
                        {project.category.split('+')[0].trim()}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {project.techStack[0]}
                      </span>
                    </div>

                    <h5 className="font-display font-bold text-xs sm:text-sm text-white light:text-slate-900 group-hover:text-brand-violet-glow transition-colors line-clamp-1">
                      {project.title}
                    </h5>

                    <p className="text-[11px] text-slate-400 light:text-slate-600 mt-1 leading-snug line-clamp-2">
                      {project.summary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 light:border-slate-200 flex items-center justify-between text-[10px] font-mono text-brand-cyan group-hover:text-brand-violet-glow">
                    <span>Inspect System</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Case Study Modal with Back button support */}
      <ProjectModal
        project={selectedProject}
        onClose={closeProject}
      />
    </section>
  );
}

export default Projects;
