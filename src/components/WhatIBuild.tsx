import { useState } from 'react';
import {
  Layers,
  Terminal,
  Brain,
  Cpu,
  Eye,
  Globe,
  Award,
} from 'lucide-react';
import { WHAT_I_BUILD_PILLARS } from '../data/portfolioData';

const iconMap: Record<string, any> = {
  Terminal,
  Brain,
  Cpu,
  Eye,
  Globe,
  Award,
};

const pillarThemes: Record<string, { color: string; border: string; glow: string; bg: string }> = {
  'p-iot': {
    color: 'text-amber-400',
    border: 'hover:border-amber-500/50',
    glow: 'group-hover:shadow-amber-500/10',
    bg: 'bg-amber-500/10',
  },
  'p-ai': {
    color: 'text-rose-400',
    border: 'hover:border-rose-500/50',
    glow: 'group-hover:shadow-rose-500/10',
    bg: 'bg-rose-500/10',
  },
  'p-cv': {
    color: 'text-cyan-400',
    border: 'hover:border-cyan-500/50',
    glow: 'group-hover:shadow-cyan-500/10',
    bg: 'bg-cyan-500/10',
  },
  'p-web': {
    color: 'text-brand-blue-glow',
    border: 'hover:border-brand-blue/50',
    glow: 'group-hover:shadow-brand-blue/10',
    bg: 'bg-brand-blue/10',
  },
  'p-cs': {
    color: 'text-emerald-400',
    border: 'hover:border-emerald-500/50',
    glow: 'group-hover:shadow-emerald-500/10',
    bg: 'bg-emerald-500/10',
  },
  'p-hardware': {
    color: 'text-brand-violet-glow',
    border: 'hover:border-brand-violet/50',
    glow: 'group-hover:shadow-brand-violet/10',
    bg: 'bg-brand-violet/10',
  },
};

export function WhatIBuild() {
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

  return (
    <section id="build" className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan-glow light:text-brand-cyan font-mono text-xs uppercase tracking-wider mb-2.5">
            <Layers className="w-3.5 h-3.5" />
            <span>03 // ARCHITECTURAL MATRIX</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            What I Build & Engineer
          </h2>
          <p className="mt-2 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-xl">
            Uniting physical sensing, algorithmic intelligence, and scalable software platforms into cohesive systems.
          </p>
        </div>

        {/* Matrix of Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHAT_I_BUILD_PILLARS.map((pillar) => {
            const Icon = iconMap[pillar.icon] || Terminal;
            const theme = pillarThemes[pillar.id] || {
              color: 'text-brand-cyan',
              border: 'hover:border-brand-blue/50',
              glow: 'group-hover:shadow-brand-blue/10',
              bg: 'bg-brand-blue/10',
            };
            const isHovered = hoveredPillar === pillar.id;

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => setHoveredPillar(pillar.id)}
                onMouseLeave={() => setHoveredPillar(null)}
                className={`card-cyber p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 group ${theme.border} ${theme.glow} ${
                  isHovered ? '-translate-y-1' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-current text-brand-cyan" />
                      {pillar.codeTag}
                    </span>
                    <div className={`p-2.5 rounded-xl ${theme.bg} border border-white/10 light:border-slate-200 transition-transform group-hover:scale-110`}>
                      <Icon className={`w-4 h-4 ${theme.color}`} />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base sm:text-lg text-white light:text-slate-900 mb-2 group-hover:text-brand-cyan transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-slate-300 light:text-slate-600 text-xs leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-white/10 light:border-slate-200">
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-dark-bg/80 light:bg-slate-100 text-[10px] font-mono text-slate-300 light:text-slate-700 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhatIBuild;
