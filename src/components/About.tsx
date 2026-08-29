import {
  BrainCircuit,
  Wrench,
  Rocket,
  TerminalSquare,
  Sparkles,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Code2,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { resolveAssetUrl, resolveWebpUrl } from '../utils/assetUrl';

export function About() {
  const avatarJpg = resolveAssetUrl(PERSONAL_INFO.avatarUrl || '/profile.jpg');
  const avatarWebp = resolveWebpUrl(PERSONAL_INFO.avatarWebp || '/profile.webp');

  const corePillars = [
    {
      icon: Wrench,
      title: 'Pragmatic System Builder',
      badge: 'Hardware to Cloud',
      desc: 'Hands-on engineer who transforms theoretical ideas into working hardware prototypes, embedded firmware, scalable backend services, and interactive frontends.',
      color: 'text-brand-blue',
      bgColor: 'bg-brand-blue/10',
      borderColor: 'border-brand-blue/30',
      glow: 'hover:border-brand-blue/60 hover:shadow-brand-blue/20',
    },
    {
      icon: BrainCircuit,
      title: 'Software + AI Fusion',
      badge: 'Intelligent Systems',
      desc: 'Architects modern applications where applied machine learning, computer vision, and NLP serve as core intelligence layers rather than isolated add-ons.',
      color: 'text-brand-violet-glow',
      bgColor: 'bg-brand-violet/10',
      borderColor: 'border-brand-violet/30',
      glow: 'hover:border-brand-violet/60 hover:shadow-brand-violet/20',
    },
    {
      icon: Rocket,
      title: 'Founder Mindset & Rigor',
      badge: 'Product Velocity',
      desc: 'Combines algorithmic depth (DSA in Java & Python) with technical product ownership, building dependable solutions from ground zero to production deployment.',
      color: 'text-brand-cyan',
      bgColor: 'bg-brand-cyan/10',
      borderColor: 'border-brand-cyan/30',
      glow: 'hover:border-brand-cyan/60 hover:shadow-brand-cyan/20',
    },
  ];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/25 text-brand-blue-glow light:text-brand-blue font-mono text-xs uppercase tracking-wider mb-3 shadow-sm">
            <TerminalSquare className="w-3.5 h-3.5" />
            <span>01 // IDENTITY & BACKGROUND</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white light:text-slate-900 tracking-tight">
            Architecting Robust Software <br className="hidden sm:block" />
            <span className="text-gradient-electric">& Intelligent Physical-Digital Systems</span>
          </h2>
          <p className="mt-3 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            From low-level microcontrollers and firmware to scalable cloud backends, NLP engines, and real-time computer vision interfaces.
          </p>
        </div>

        {/* ========================================================= */}
        {/* BALANCED 2-COLUMN GRID (Persona & Story vs. Academic Trajectory) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ------------------------------------------------------------- */}
          {/* LEFT COLUMN: Narrative Bio + Developer Card (6 cols) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-6 card-cyber p-6 sm:p-7 border-brand-blue/30 bg-gradient-to-br from-dark-card/95 via-dark-surface/90 to-dark-card/95 flex flex-col justify-between h-full">
            <div>
              {/* Header inside Persona Card */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 light:border-slate-200 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-violet to-brand-cyan p-[2px] shadow-lg shadow-brand-blue/25 shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-dark-bg overflow-hidden relative">
                      <picture>
                        {avatarWebp && <source srcSet={avatarWebp} type="image/webp" />}
                        <img
                          src={avatarJpg}
                          alt={PERSONAL_INFO.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </picture>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white light:text-slate-900 leading-tight">
                      {PERSONAL_INFO.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan">
                      <span>SDE + AI Engineer</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Coimbatore, TN
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Open to Impact Roles</span>
                </div>
              </div>

              {/* Narrative Story */}
              <div className="space-y-3 text-slate-300 light:text-slate-600 text-xs sm:text-sm leading-relaxed">
                <p>
                  I am a passionate <strong className="text-white light:text-slate-900 font-semibold">Software Development & AI Engineer</strong> driven by building end-to-end products that connect intelligent algorithms with real-world utility.
                </p>
                <p>
                  My engineering foundation was forged during my <strong className="text-brand-cyan font-semibold">Diploma in CSE at Sri Ramakrishna Polytechnic College (SRPTC)</strong> (2023–2026), graduating with a <strong className="text-emerald-400 font-bold">9.78 CGPA (Top Distinction)</strong>. I led multidisciplinary teams to engineer <strong className="text-white light:text-slate-900 font-semibold">8+ major physical-digital systems</strong> spanning IoT telematics, Java NLP engines, and full-stack web portals, earning 7 verified technical awards.
                </p>
                <p>
                  Currently advancing my <strong className="text-brand-violet-glow light:text-brand-violet font-semibold">B.Tech in IT @ Kumaraguru College of Technology (KCT)</strong>, I focus on DSA in Java & Python, high-throughput microservice backends, and low-latency computer vision pipelines.
                </p>
              </div>

              {/* Career Objectives Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-white/10 light:border-slate-200">
                <div className="p-3 rounded-xl bg-dark-bg/60 light:bg-slate-100 border border-brand-blue/20 flex items-start gap-2.5">
                  <Code2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-blue-glow uppercase block">
                      Core Discipline
                    </span>
                    <span className="text-xs font-semibold text-white light:text-slate-900 block mt-0.5">
                      Software Architecture & Applied AI
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-dark-bg/60 light:bg-slate-100 border border-brand-violet/20 flex items-start gap-2.5">
                  <Rocket className="w-4 h-4 text-brand-violet-glow shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-violet-glow uppercase block">
                      Long-Term Ambition
                    </span>
                    <span className="text-xs font-semibold text-white light:text-slate-900 block mt-0.5">
                      Technical Product Founder
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Strip inside Left Card */}
            <div className="mt-5 pt-3 border-t border-white/10 light:border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-mono font-bold text-brand-cyan uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Mindset
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-300 light:text-slate-700">
                <span className="px-2 py-0.5 rounded bg-dark-bg light:bg-slate-100 border border-white/5">
                  ⚡ High Velocity Execution
                </span>
                <span className="px-2 py-0.5 rounded bg-dark-bg light:bg-slate-100 border border-white/5">
                  🎯 Zero Fluff
                </span>
                <span className="px-2 py-0.5 rounded bg-dark-bg light:bg-slate-100 border border-white/5">
                  🛡️ Full Ownership
                </span>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Education & Certifications Showcase (6 cols) */}
          {/* ------------------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between h-full">
            {/* Academic Trajectory Card */}
            <div className="card-cyber p-5 sm:p-6 border-brand-violet/30 bg-dark-card/90">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-brand-violet/20 text-brand-violet-glow">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-bold text-base text-white light:text-slate-900">
                    Academic Trajectory
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/10 text-brand-violet-glow border border-brand-violet/30">
                  Verified Records
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. SRPTC Diploma */}
                <div className="p-3.5 rounded-xl bg-dark-bg/80 light:bg-slate-100 border border-brand-blue/30 relative overflow-hidden group hover:border-brand-blue/60 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      9.78 CGPA • TOP DISTINCTION
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      2023 – 2026
                    </span>
                  </div>

                  <h5 className="font-display font-bold text-xs sm:text-sm text-white light:text-slate-900 mt-1">
                    Diploma in Computer Science & Engineering
                  </h5>

                  <p className="text-[11px] font-mono text-brand-cyan mt-0.5">
                    Sri Ramakrishna Polytechnic College (SRPTC)
                  </p>

                  <ul className="mt-2 space-y-1 text-[11px] text-slate-300 light:text-slate-700">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Graduated with <strong>9.78 CGPA</strong> (Top Tier Distinction)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Led 8+ engineering hardware, web & AI systems</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Won 7 National & State level technical symposium awards</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Class Representative (60+ students) & Event Organizer</span>
                    </li>
                  </ul>
                </div>

                {/* 2. KCT B.Tech */}
                <div className="p-3.5 rounded-xl bg-dark-bg/80 light:bg-slate-100 border border-brand-violet/30 relative overflow-hidden group hover:border-brand-violet/60 transition-all">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-brand-violet/20 text-brand-violet-glow font-bold border border-brand-violet/30">
                      CURRENTLY PURSUING
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      2026 – Present
                    </span>
                  </div>

                  <h5 className="font-display font-bold text-xs sm:text-sm text-white light:text-slate-900 mt-1">
                    B.Tech in Information Technology
                  </h5>

                  <p className="text-[11px] font-mono text-brand-violet-glow mt-0.5">
                    Kumaraguru College of Technology (KCT)
                  </p>

                  <p className="text-[11px] text-slate-300 light:text-slate-700 mt-1.5 leading-snug">
                    Advanced specialization in Data Structures & Algorithms (Java/Python), distributed microservice backends, and applied AI product engineering.
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Certifications Highlight Card */}
            <div className="card-cyber p-4 sm:p-5 border-emerald-500/30 bg-dark-card/90">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs sm:text-sm text-white light:text-slate-900">
                      25+ Verified Technical Certifications
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400">
                      AI, Cloud, Database Security, IoT & Management
                    </p>
                  </div>
                </div>

                <a
                  href="#certifications"
                  className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0"
                >
                  View All <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>

              {/* Certification Platform Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Infosys Springboard', 'IBM SkillsBuild', 'GUVI / Skill India', 'Udemy', 'Naan Mudhalvan'].map((plat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-bg/90 light:bg-slate-100 border border-white/5 light:border-slate-200 text-slate-300 light:text-slate-700"
                  >
                    {plat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* HORIZONTAL 3-COLUMN PILLARS STRIP (Full Width Symmetrical) */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="text-[11px] font-mono font-bold text-brand-cyan uppercase tracking-wider">
              // Core Architectural Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {corePillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className={`card-cyber p-4 border ${p.borderColor} ${p.glow} transition-all group flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className={`p-2 rounded-lg ${p.bgColor} border ${p.borderColor} shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-4 h-4 ${p.color}`} />
                      </div>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                        {p.badge}
                      </span>
                    </div>

                    <h5 className="font-display font-bold text-sm text-white light:text-slate-900 group-hover:text-brand-cyan transition-colors">
                      {p.title}
                    </h5>

                    <p className="text-[11px] text-slate-400 light:text-slate-600 mt-1.5 leading-relaxed">
                      {p.desc}
                    </p>
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

export default About;
