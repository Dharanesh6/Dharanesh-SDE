import { useState } from 'react';
import {
  Briefcase,
  Building2,
  Clock,
  CheckCircle2,
  Users,
  ShieldCheck,
  Wrench,
  Sparkles,
  Layers,
  Zap,
  MapPin,
  Calendar,
  Network,
  BrainCircuit,
  Award,
} from 'lucide-react';
import { INTERNSHIP, WORKSHOPS, LEADERSHIP_ROLES } from '../data/portfolioData';

export function Experience() {
  const [activeTab, setActiveTab] = useState<'all' | 'internship' | 'workshops' | 'leadership'>('all');

  const tabs = [
    { id: 'all' as const, label: 'All Experience', count: 1 + WORKSHOPS.length + LEADERSHIP_ROLES.length },
    { id: 'internship' as const, label: 'AI Internship', count: 1, badge: '50h Verified' },
    { id: 'workshops' as const, label: 'Workshops & Bootcamps', count: WORKSHOPS.length },
    { id: 'leadership' as const, label: 'Leadership Roles', count: LEADERSHIP_ROLES.length },
  ];

  return (
    <section id="experience" className="py-16 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40 light:bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-violet/10 border border-brand-violet/20 text-brand-violet-glow light:text-brand-violet font-mono text-xs uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>09 // EXPERIENCE & HANDS-ON TRAINING</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            Internship, Workshops & Leadership
          </h2>
          <p className="mt-2 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-xl">
            Hands-on AI systems engineering internship, intensive technical hardware & networking bootcamps, and student leadership responsibilities.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-brand-violet/20 text-brand-violet-glow border border-brand-violet/50 font-semibold shadow-sm shadow-brand-violet/20'
                    : 'bg-dark-card light:bg-white text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 border border-white/5 light:border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    {tab.badge}
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 light:bg-slate-200 text-slate-400 light:text-slate-700">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. FEATURED INTERNSHIP SHOWCASE */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'internship') && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-brand-violet/10 border border-brand-violet/30 text-brand-violet-glow">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white light:text-slate-900">
                Engineering Internship
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                // System Simulation & AI Architecture
              </span>
            </div>

            <div className="card-cyber p-6 sm:p-7 border-brand-violet/40 bg-gradient-to-br from-dark-card/90 via-dark-surface/80 to-dark-card/90 relative overflow-hidden">
              {/* Subtle Ambient Gradient Accents */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-blue/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

              <div className="relative z-10">
                {/* Top Badge Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-violet/20 text-brand-violet-glow border border-brand-violet/40 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI & SYSTEM DESIGN INTERNSHIP
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-brand-blue/15 text-brand-cyan border border-brand-blue/30">
                      {INTERNSHIP.role || 'Engineering Intern'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Completion
                    </span>
                    <span className="text-slate-400 light:text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-violet" /> 50 Hours
                    </span>
                  </div>
                </div>

                {/* Title and Organization */}
                <div className="mb-4">
                  <h4 className="font-display font-bold text-xl sm:text-2xl text-white light:text-slate-900 tracking-tight">
                    {INTERNSHIP.title}
                  </h4>
                  <div className="mt-1.5 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-300 light:text-slate-700">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Building2 className="w-4 h-4 text-brand-violet shrink-0" />
                      {INTERNSHIP.organization}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 light:text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {INTERNSHIP.location}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 light:text-slate-500 font-mono text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {INTERNSHIP.duration}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 light:text-slate-600 leading-relaxed mb-5">
                  {INTERNSHIP.summary}
                </p>

                {/* Key Learnings Grid */}
                <div className="mb-5">
                  <span className="text-[11px] font-mono font-bold text-brand-cyan uppercase tracking-wider block mb-2.5">
                    // Core Competencies & Key Learnings
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {INTERNSHIP.keyLearnings.map((learning, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-dark-bg/60 light:bg-slate-100/70 border border-white/5 light:border-slate-200 text-xs text-slate-200 light:text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{learning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Tags Strip */}
                {INTERNSHIP.skills && INTERNSHIP.skills.length > 0 && (
                  <div className="pt-4 border-t border-white/10 light:border-slate-200 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 mr-1.5">Domain Skills:</span>
                    {INTERNSHIP.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-dark-card light:bg-white border border-white/10 light:border-slate-300 text-slate-300 light:text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. TECHNICAL WORKSHOPS & BOOTCAMPS */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'workshops') && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white light:text-slate-900">
                Technical Workshops & Bootcamps
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                // Hardware Labs, Networking & Spatial Tech
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {WORKSHOPS.map((workshop) => {
                const isHardware = workshop.title.toLowerCase().includes('troubleshooting') || workshop.title.toLowerCase().includes('networking');
                const isARVR = workshop.title.toLowerCase().includes('ar/vr');
                
                return (
                  <div
                    key={workshop.id || workshop.title}
                    className="card-cyber p-5 flex flex-col justify-between border-white/10 hover:border-brand-cyan/40 group"
                  >
                    <div>
                      {/* Top Meta Strip */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 flex items-center gap-1">
                          {isHardware ? (
                            <Network className="w-3 h-3" />
                          ) : isARVR ? (
                            <Layers className="w-3 h-3" />
                          ) : (
                            <Zap className="w-3 h-3" />
                          )}
                          {workshop.badge || workshop.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {workshop.date}
                        </span>
                      </div>

                      {/* Workshop Title */}
                      <h4 className="font-display font-bold text-sm sm:text-base text-white light:text-slate-900 group-hover:text-brand-cyan transition-colors line-clamp-2">
                        {workshop.title}
                      </h4>

                      {/* Organizer */}
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                        <span className="truncate">{workshop.organizer}</span>
                      </div>

                      {/* Description */}
                      <p className="mt-2.5 text-xs text-slate-300 light:text-slate-600 leading-relaxed">
                        {workshop.description}
                      </p>

                      {/* Highlights */}
                      {workshop.keyHighlights && workshop.keyHighlights.length > 0 && (
                        <div className="mt-3.5 space-y-1.5">
                          {workshop.keyHighlights.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300 light:text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 shrink-0" />
                              <span className="line-clamp-2 leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Skill Tags */}
                    {workshop.skills && workshop.skills.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-white/10 light:border-slate-200 flex flex-wrap gap-1">
                        {workshop.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dark-bg light:bg-slate-100 text-slate-300 light:text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. TECHNICAL LEADERSHIP & STUDENT REPRESENTATION */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'leadership') && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/30 text-brand-blue">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white light:text-slate-900">
                Technical Leadership & Representation
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                // Team Lead, Class Representative & Event Organizer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LEADERSHIP_ROLES.map((role, idx) => (
                <div
                  key={idx}
                  className="card-cyber p-5 flex flex-col justify-between border-white/10 hover:border-brand-blue/40 group"
                >
                  <div>
                    {/* Role Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-blue/15 text-brand-cyan border border-brand-blue/30">
                        {role.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {role.period}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-sm sm:text-base text-white light:text-slate-900 flex items-center gap-2 group-hover:text-brand-blue transition-colors">
                      <Users className="w-4 h-4 text-brand-cyan shrink-0" />
                      <span>{role.title}</span>
                    </h4>

                    <p className="text-[11px] font-mono text-slate-400 light:text-slate-500 mt-1 mb-3">
                      {role.organization}
                    </p>

                    {/* Impact Bullet Points */}
                    <ul className="space-y-2">
                      {role.impact.map((imp, iIdx) => (
                        <li key={iIdx} className="text-xs text-slate-300 light:text-slate-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-violet mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/5 light:border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Verified Academic / Project Record</span>
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Experience;
