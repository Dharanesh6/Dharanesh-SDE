import { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Calendar,
  MapPin,
} from 'lucide-react';
import { JOURNEY_ROADMAP } from '../data/portfolioData';

export function Journey() {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(1); // Default to current B.Tech

  return (
    <section id="journey" className="py-14 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40 light:bg-slate-100/40">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-violet/10 border border-brand-violet/20 text-brand-violet-glow light:text-brand-violet font-mono text-xs uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>02 // TRAJECTORY</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            Engineering Roadmap
          </h2>
          <p className="mt-1.5 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-lg">
            From hands-on polytechnic systems builder to B.Tech IT at KCT.
          </p>
        </div>

        {/* Milestone Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
          {JOURNEY_ROADMAP.map((item, idx) => {
            const isSelected = selectedMilestone === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedMilestone(idx)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'card-cyber border-brand-blue/50 bg-brand-blue/10 light:bg-white shadow-md shadow-brand-blue/10'
                    : 'bg-dark-surface/40 light:bg-white/60 border-white/5 light:border-slate-200 hover:border-brand-blue/30 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-semibold text-brand-cyan">
                    {item.year}
                  </span>
                  {item.isCurrent && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  )}
                  {item.isFuture && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Target
                    </span>
                  )}
                </div>
                <div className="font-display font-semibold text-xs text-white light:text-slate-900 truncate">
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Card */}
        {(() => {
          const active = JOURNEY_ROADMAP[selectedMilestone];
          return (
            <div className="card-cyber p-5 sm:p-7 border-brand-blue/30 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 light:border-slate-200">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-brand-blue-glow mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{active.year}</span>
                    <span className="text-slate-500">•</span>
                    <span className="uppercase text-brand-cyan font-semibold text-[11px]">
                      {active.period}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white light:text-slate-900">
                    {active.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 light:text-slate-600">
                    <span className="font-semibold text-slate-200 light:text-slate-800">
                      {active.institution}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                      <MapPin className="w-3 h-3 text-brand-violet" />
                      {active.location}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-lg text-xs font-mono border border-brand-blue/40 bg-brand-blue/10 text-brand-cyan w-fit">
                  {active.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
                <div className="md:col-span-7">
                  <p className="text-slate-300 light:text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {active.description}
                  </p>
                </div>

                <div className="md:col-span-5 bg-dark-bg/60 light:bg-slate-50 p-4 rounded-xl border border-white/5 light:border-slate-200">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-brand-cyan font-semibold block mb-2">
                    Key Highlights
                  </span>
                  <ul className="space-y-1.5">
                    {active.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300 light:text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
