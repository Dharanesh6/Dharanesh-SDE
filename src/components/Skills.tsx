import { useState } from 'react';
import {
  Code2,
  Server,
  Brain,
  Scan,
  Radio,
  Cpu,
  Search,
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

const iconMap: Record<string, any> = {
  Code: Code2,
  Server,
  Brain,
  Scan,
  Radio,
  Cpu,
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCategories = SKILL_CATEGORIES.filter((category) => {
    if (activeCategory !== 'all' && category.id !== activeCategory) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      return category.skills.some(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.practicalUse.toLowerCase().includes(term) ||
          s.tag.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <section id="skills" className="py-14 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/30 light:bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-blue/10 border border-brand-blue/20 text-brand-blue-glow light:text-brand-blue font-mono text-xs uppercase tracking-wider mb-2">
            <Code2 className="w-3.5 h-3.5" />
            <span>04 // TOOLKIT</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            Skills & Technologies
          </h2>
          <p className="mt-1.5 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-lg">
            Practical stack verified across built hardware, algorithms, and applications.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-brand-blue text-white font-medium'
                  : 'bg-dark-card/80 light:bg-white text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 border border-white/5 light:border-slate-200'
              }`}
            >
              All
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-brand-blue text-white font-medium'
                    : 'bg-dark-card/80 light:bg-white text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 border border-white/5 light:border-slate-200'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-lg text-xs font-mono bg-dark-card light:bg-white border border-white/10 light:border-slate-300 text-slate-200 light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.iconName] || Code2;
            const displayedSkills = searchTerm.trim()
              ? category.skills.filter(
                  (s) =>
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.practicalUse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.tag.toLowerCase().includes(searchTerm.toLowerCase())
                )
              : category.skills;

            if (displayedSkills.length === 0) return null;

            return (
              <div key={category.id} className="card-cyber p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10 light:border-slate-200">
                    <Icon className="w-4 h-4 text-brand-cyan" />
                    <h3 className="font-display font-semibold text-sm text-white light:text-slate-900">
                      {category.name}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {displayedSkills.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2 rounded-lg bg-dark-bg/50 light:bg-slate-50 border border-white/5 light:border-slate-200 hover:border-brand-blue/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-medium text-white light:text-slate-900">
                            {skill.name}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand-blue/15 text-brand-cyan">
                            {skill.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 light:text-slate-600 mt-0.5">
                          {skill.practicalUse}
                        </p>
                      </div>
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
