import {
  ArrowUp,
  ShieldCheck,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './Icons';
import { PERSONAL_INFO } from '../data/portfolioData';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10 light:border-slate-200 relative bg-dark-bg light:bg-slate-50 text-slate-400 light:text-slate-600">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/5 light:border-slate-200">
          {/* Brand & Positioning */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-white light:text-slate-900 tracking-tight">
                {PERSONAL_INFO.name}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-brand-cyan font-semibold">
                SDE + AI Engineer
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 light:text-slate-500 mt-0.5">
              B.Tech IT @ Kumaraguru College of Technology (KCT)
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5">
            <a
              href={PERSONAL_INFO.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-dark-surface/80 light:bg-white border border-white/10 light:border-slate-300 hover:text-brand-blue hover:border-brand-blue/50 transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-dark-surface/80 light:bg-white border border-white/10 light:border-slate-300 hover:text-brand-blue hover:border-brand-blue/50 transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={PERSONAL_INFO.social.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-dark-surface/80 light:bg-white border border-white/10 light:border-slate-300 hover:text-amber-400 hover:border-amber-400/50 transition-colors"
              aria-label="LeetCode"
            >
              <LeetCodeIcon className="w-4 h-4" />
            </a>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-brand-blue/20 text-brand-cyan hover:bg-brand-blue/30 border border-brand-blue/40 transition-colors ml-1 cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Integrity Badge */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Verified Project & Competition Records</span>
          </div>

          <div>
            © {new Date().getFullYear()} Dharanesh K. Architected with React & TypeScript.
          </div>
        </div>
      </div>
    </footer>
  );
}
