import {
  TrendingUp,
} from 'lucide-react';
import { CURRENTLY_EXPLORING } from '../data/portfolioData';

export function CurrentlyExploring() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/30 light:bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        <div className="card-cyber p-5 sm:p-7 border-white/10 light:border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10 light:border-slate-200">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-cyan font-semibold uppercase tracking-wider mb-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                ACTIVE LEARNING ROADMAP
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white light:text-slate-900">
                What I'm Deep-Diving Into Now
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
              Daily Practice Focus
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CURRENTLY_EXPLORING.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-dark-bg/60 light:bg-slate-50 border border-white/5 light:border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand-blue/20 text-brand-cyan">
                      {item.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{item.status}</span>
                  </div>
                  <h4 className="font-display font-semibold text-xs text-white light:text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 light:text-slate-600 mt-1 line-clamp-2">
                    {item.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
