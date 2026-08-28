import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Cpu,
  Layers,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './Icons';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HeroProps {
  onExploreProjects: () => void;
  onExploreSkills: () => void;
  onExploreAILab: () => void;
}

export function Hero({
  onExploreProjects,
  onExploreSkills,
  onExploreAILab,
}: HeroProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  // Typewriter effect for animated roles
  useEffect(() => {
    const currentRole = PERSONAL_INFO.roles[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        if (displayedText.length + 1 === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 1600);
          setTypingSpeed(45);
        }
      } else {
        setDisplayedText(currentRole.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % PERSONAL_INFO.roles.length);
          setTypingSpeed(75);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex, typingSpeed]);

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[300px] bg-gradient-to-tr from-brand-blue/20 via-brand-violet/20 to-brand-cyan/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-blue/30 bg-dark-surface/80 light:bg-white/90 backdrop-blur-md shadow-md mb-6">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-brand-cyan tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            <span>CURRENTLY BUILDING</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/20 light:bg-slate-400" />
          <span className="text-xs font-mono text-slate-300 light:text-slate-700 font-medium">
            B.Tech IT @ <span className="text-white light:text-slate-900 font-semibold">Kumaraguru College of Technology</span>
          </span>
        </div>

        {/* Developer Name */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white light:text-slate-900 mb-3 leading-none">
          <span className="text-gradient-electric">{PERSONAL_INFO.name}</span>
        </h1>

        {/* Animated Typing Role Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg sm:text-2xl font-display font-medium text-slate-300 light:text-slate-700 mb-4">
          <span className="px-2.5 py-0.5 rounded-lg bg-white/5 light:bg-slate-200/70 border border-white/10 light:border-slate-300 text-brand-blue-glow light:text-brand-blue font-semibold tracking-wide font-mono text-sm sm:text-lg">
            SDE + AI Engineer
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <div className="min-h-[32px] flex items-center">
            <span className="text-brand-cyan-glow light:text-cyan-700 font-mono text-sm sm:text-lg">
              {displayedText}
            </span>
            <span className="inline-block w-2 h-4 sm:h-5 bg-brand-cyan ml-1 animate-pulse" />
          </div>
        </div>

        {/* Concise Statement */}
        <p className="max-w-xl text-slate-300 light:text-slate-600 text-xs sm:text-sm leading-relaxed mb-8">
          {PERSONAL_INFO.statement}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={onExploreProjects}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan hover:opacity-95 shadow-md shadow-brand-blue/20 transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Explore Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onExploreAILab}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-medium text-slate-200 light:text-slate-800 bg-dark-card/90 light:bg-white/90 border border-brand-violet/30 hover:border-brand-violet transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-violet-glow" />
            <span>AI & CV Lab</span>
          </button>

          <button
            onClick={onExploreSkills}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-medium text-slate-300 light:text-slate-700 bg-dark-surface/70 light:bg-slate-100/80 border border-white/10 light:border-slate-300 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skills</span>
          </button>
        </div>

        {/* Social Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-white/10 light:border-slate-200 w-full max-w-md">
          <a
            href={PERSONAL_INFO.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-surface/60 light:bg-white border border-white/10 light:border-slate-200 text-xs font-mono text-slate-300 light:text-slate-700 hover:text-brand-blue transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5 text-brand-cyan" />
            <span>GitHub</span>
          </a>

          <a
            href={PERSONAL_INFO.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-surface/60 light:bg-white border border-white/10 light:border-slate-200 text-xs font-mono text-slate-300 light:text-slate-700 hover:text-brand-blue transition-colors"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-brand-blue" />
            <span>LinkedIn</span>
          </a>

          <a
            href={PERSONAL_INFO.social.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-surface/60 light:bg-white border border-white/10 light:border-slate-200 text-xs font-mono text-slate-300 light:text-slate-700 hover:text-amber-400 transition-colors"
          >
            <LeetCodeIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>LeetCode</span>
          </a>
        </div>
      </div>
    </section>
  );
}
