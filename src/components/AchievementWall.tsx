import { useState } from 'react';
import {
  Trophy,
  Calendar,
  Building2,
  Medal,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACHIEVEMENTS } from '../data/portfolioData';
import type { CertificateModalData } from '../types/portfolio';

interface AchievementWallProps {
  onViewCertificate?: (cert: CertificateModalData) => void;
}

export function AchievementWall({ onViewCertificate }: AchievementWallProps) {
  const [activeFilter, setActiveFilter] = useState<string>('prizes');
  const [showAll, setShowAll] = useState<boolean>(false);

  const handlePrizeCelebrate = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#8B5CF6', '#06B6D4', '#F59E0B'],
      });
    } catch {}
  };

  const filteredAchievements = ACHIEVEMENTS.filter((item) => {
    if (activeFilter === 'prizes') return item.prize !== 'Participation';
    if (activeFilter === 'participations') return item.prize === 'Participation';
    if (activeFilter === '1st') return item.prize === '1st Prize';
    return true;
  });

  const displayedList = showAll ? filteredAchievements : filteredAchievements.slice(0, 6);

  const handleOpenCertificate = (item: (typeof ACHIEVEMENTS)[0]) => {
    if (!item.certificateUrl || !onViewCertificate) return;
    onViewCertificate({
      title: item.title,
      issuer: item.institution,
      category: item.level,
      date: item.date,
      imageUrl: item.certificateUrl,
      badge: item.prize,
      verified: true,
    });
  };

  return (
    <section id="achievements" className="py-14 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>07 // COMPETITIONS</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            Achievements & Awards
          </h2>
          <p className="mt-1.5 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-lg">
            7 verified prize wins and 10 state/national symposium participations with individual certificate verification.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'prizes', label: 'Prize Wins (7)' },
              { id: '1st', label: '1st Prizes (5)' },
              { id: 'participations', label: 'Participations (10)' },
              { id: 'all', label: 'All Records (17)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  if (tab.id === '1st') handlePrizeCelebrate();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'bg-dark-card light:bg-white text-slate-400 light:text-slate-600 hover:text-white border border-white/5 light:border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            Showing {displayedList.length} of {filteredAchievements.length}
          </span>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedList.map((item) => {
            const isFirstPrize = item.prize === '1st Prize';
            const isPrize = item.prize !== 'Participation';
            const hasCert = !!item.certificateUrl;

            return (
              <div
                key={item.id}
                onClick={() => hasCert && handleOpenCertificate(item)}
                className={`p-4 rounded-xl transition-all border flex flex-col justify-between group ${
                  hasCert ? 'cursor-pointer' : ''
                } ${
                  isFirstPrize
                    ? 'bg-gradient-to-br from-dark-card to-amber-950/20 light:from-white light:to-amber-50/50 border-amber-500/30 hover:border-amber-400/60'
                    : 'bg-dark-surface/70 light:bg-white border-white/5 light:border-slate-200 hover:border-brand-blue/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isFirstPrize
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : isPrize
                          ? 'bg-brand-blue/20 text-brand-cyan border border-brand-blue/30'
                          : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      <Medal className="w-3 h-3" />
                      {item.prize}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-white light:text-slate-900 leading-snug group-hover:text-amber-300 light:group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h4>

                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-slate-400 light:text-slate-600">
                    <Building2 className="w-3 h-3 text-brand-violet shrink-0" />
                    <span className="truncate">{item.institution}</span>
                  </div>

                  {item.description && (
                    <p className="mt-2 text-[11px] text-slate-400 light:text-slate-600 leading-normal line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Certificate Action Strip */}
                {hasCert && (
                  <div className="mt-3.5 pt-2.5 border-t border-white/5 light:border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      <span>Certificate Attached</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCertificate(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Certificate</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show More Toggle Button */}
        {filteredAchievements.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-dark-card light:bg-slate-100 hover:bg-dark-card-hover text-slate-300 light:text-slate-800 border border-white/10 light:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{showAll ? 'Show Less' : `View All ${filteredAchievements.length} Records`}</span>
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AchievementWall;

