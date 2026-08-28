import {
  Cpu,
  Trophy,
  Activity,
  BookOpen,
  Briefcase,
  Users,
} from 'lucide-react';
import { STATS } from '../data/portfolioData';

const statIcons = [Cpu, Trophy, Activity, BookOpen, Briefcase, Users];

export function EngineeringStats() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="card-cyber p-4 sm:p-6 border-white/10 light:border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {STATS.map((stat, idx) => {
              const Icon = statIcons[idx % statIcons.length];
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-dark-bg/60 light:bg-slate-50 border border-white/5 light:border-slate-200 flex flex-col justify-center items-center text-center group hover:border-brand-blue/40 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-dark-card light:bg-white border border-white/5 light:border-slate-200 mb-2 group-hover:scale-110 transition-transform text-brand-cyan">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-mono font-extrabold text-xl sm:text-2xl text-white light:text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 font-display font-medium text-[11px] text-slate-200 light:text-slate-800 leading-tight">
                    {stat.label}
                  </div>
                  <div className="mt-0.5 text-[9px] font-mono text-slate-400 light:text-slate-500 line-clamp-1">
                    {stat.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EngineeringStats;
