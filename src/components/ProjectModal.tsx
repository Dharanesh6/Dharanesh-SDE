import { useEffect } from 'react';
import {
  X,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import type { ProjectItem } from '../types/portfolio';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-bg/85 light:bg-slate-900/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl bg-dark-surface light:bg-white border border-brand-blue/30 light:border-slate-300 shadow-2xl shadow-brand-blue/20 z-10 animate-in zoom-in-95 duration-200 p-5 sm:p-7 text-left">
        {/* Top Navigation Bar with Back button & Close button */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10 light:border-slate-200 sticky top-0 bg-dark-surface/95 light:bg-white/95 backdrop-blur-md z-20">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-brand-cyan hover:text-white light:text-brand-blue light:hover:text-slate-900 bg-brand-blue/10 light:bg-slate-100 hover:bg-brand-blue/20 border border-brand-blue/30 transition-colors cursor-pointer"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>

          <div className="flex items-center gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 shadow-sm transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-200 light:text-slate-800 bg-dark-card light:bg-slate-100 border border-white/10 hover:border-brand-blue transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-dark-card light:bg-slate-100 border border-white/10 light:border-slate-300 text-slate-400 hover:text-white light:hover:text-slate-900 transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Header Badge & Title */}
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {project.isFlagship && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                FLAGSHIP CASE STUDY
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-brand-blue/15 text-brand-cyan border border-brand-blue/30">
              {project.category}
            </span>
          </div>

          <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-white light:text-slate-900">
            {project.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-mono text-brand-blue-glow light:text-brand-blue">
            {project.subtitle}
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono text-slate-300 light:text-slate-700">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Role</span>
              <span className="font-semibold text-white light:text-slate-900">{project.role}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Domain</span>
              <span>{project.domain}</span>
            </div>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="mb-5 p-3 rounded-xl bg-dark-bg/60 light:bg-slate-50 border border-white/5 light:border-slate-200">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-brand-cyan" />
            Technologies & Hardware
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-dark-card light:bg-white border border-brand-blue/20 text-slate-200 light:text-slate-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Problem & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="p-4 rounded-xl bg-rose-950/20 light:bg-rose-50/80 border border-rose-500/20">
            <div className="flex items-center gap-1.5 text-rose-400 light:text-rose-600 font-mono text-xs font-bold uppercase mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              The Problem
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 light:bg-emerald-50/80 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-emerald-400 light:text-emerald-600 font-mono text-xs font-bold uppercase mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Engineered Solution
            </div>
            <p className="text-xs text-slate-300 light:text-slate-700 leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Flagship Hardware Pinout Mapping */}
        {project.hardwareComponents && project.hardwareComponents.length > 0 && (
          <div className="mb-5">
            <h3 className="font-display font-bold text-sm text-white light:text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-cyan" />
              Hardware Integration & Interface Mapping
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.hardwareComponents.map((hw, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-dark-bg/60 light:bg-slate-50 border border-white/5 light:border-slate-200"
                >
                  <div className="flex items-center justify-between font-mono text-xs font-semibold text-white light:text-slate-900">
                    <span>{hw.name}</span>
                    {hw.pin && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-blue/20 text-brand-cyan">
                        {hw.pin}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 light:text-slate-600">
                    {hw.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture & Flow */}
        {project.softwareArchitecture && (
          <div className="mb-5">
            <h3 className="font-display font-bold text-sm text-white light:text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-violet" />
              Firmware & Cloud Architecture Workflow
            </h3>
            <div className="p-3 rounded-xl bg-dark-bg/80 light:bg-slate-50 border border-brand-violet/20 space-y-1.5">
              {project.softwareArchitecture.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 text-xs font-mono text-slate-300 light:text-slate-700">
                  <span className="text-brand-violet font-bold">0{sIdx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Features */}
        <div className="mb-5">
          <h3 className="font-display font-bold text-sm text-white light:text-slate-900 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Key System Features
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {project.keyFeatures.map((feat, fIdx) => (
              <li
                key={fIdx}
                className="p-2 rounded-lg bg-dark-card/50 light:bg-slate-100/70 border border-white/5 light:border-slate-200 text-xs text-slate-300 light:text-slate-700 flex items-start gap-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0 mt-1" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Verified Outcome */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-brand-blue/10 via-brand-violet/10 to-brand-cyan/10 border border-brand-blue/30 text-xs text-slate-200 light:text-slate-800 mb-5">
          <span className="font-mono font-bold text-brand-cyan block mb-0.5 uppercase tracking-wider text-[10px]">
            Verified Result:
          </span>
          {project.verifiedOutcome}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 light:border-slate-200">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white light:text-slate-600 light:hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </button>

          <div className="flex items-center gap-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 shadow-md shadow-emerald-500/20"
              >
                <span>Launch Live Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-dark-card light:bg-slate-200 text-slate-300 light:text-slate-800 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
