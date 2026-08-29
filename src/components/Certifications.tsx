import { useState } from 'react';
import {
  BookOpen,
  Search,
  Building,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Eye,
  Layers,
} from 'lucide-react';
import { CERTIFICATIONS } from '../data/portfolioData';
import type { CertificateModalData, CertificationItem } from '../types/portfolio';

interface CertificationsProps {
  onViewCertificate?: (cert: CertificateModalData) => void;
}

export function Certifications({ onViewCertificate }: CertificationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All (25+)' },
    { id: 'AI & GenAI', label: 'AI & GenAI' },
    { id: 'Programming & Cloud', label: 'Programming & Cloud' },
    { id: 'Security & Database', label: 'Security & Database' },
    { id: 'IoT & Hardware', label: 'IoT & Hardware' },
    { id: 'Professional & Management', label: 'Professional' },
  ];

  const filteredCerts = CERTIFICATIONS.filter((cert) => {
    if (selectedCategory !== 'all' && cert.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = cert.title.toLowerCase().includes(q);
      const matchIssuer = cert.issuer.toLowerCase().includes(q);
      const matchSkill = cert.skills.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchIssuer || matchSkill;
    }
    return true;
  });

  const displayedList = showAll ? filteredCerts : filteredCerts.slice(0, 6);

  const handleOpenCertificate = (cert: CertificationItem) => {
    if (!cert.certificateUrl || !onViewCertificate) return;
    onViewCertificate({
      title: cert.title,
      issuer: cert.issuer,
      category: cert.category,
      date: cert.date,
      imageUrl: cert.certificateUrl,
      additionalImages: cert.certificateImages,
      skills: cert.skills,
      verified: true,
    });
  };

  return (
    <section id="certifications" className="py-14 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/30 light:bg-slate-50/50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-emerald/10 border border-brand-emerald/20 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>08 // CREDENTIALS</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            Verified Certification Library
          </h2>
          <p className="mt-1.5 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-lg">
            25+ verified technical credentials from Infosys, IBM, GUVI, and Udemy with direct certificate viewing.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                    : 'bg-dark-card light:bg-white text-slate-400 light:text-slate-600 hover:text-white border border-white/5 light:border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cert or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 rounded-lg text-xs font-mono bg-dark-card light:bg-white border border-white/10 light:border-slate-300 text-slate-200 light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>

        {/* Certifications Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedList.map((cert) => {
            const hasCert = !!cert.certificateUrl;
            const isMultiCert = !!(cert.certificateImages && cert.certificateImages.length > 1);

            return (
              <div
                key={cert.id}
                onClick={() => hasCert && handleOpenCertificate(cert)}
                className={`p-4 rounded-xl bg-dark-surface/70 light:bg-white border border-white/5 light:border-slate-200 flex flex-col justify-between hover:border-emerald-500/40 transition-all group ${
                  hasCert ? 'cursor-pointer' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 light:bg-slate-100 text-slate-400">
                      {cert.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {cert.date}
                    </span>
                  </div>

                  <h4 className="font-display font-semibold text-xs sm:text-sm text-white light:text-slate-900 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {cert.title}
                  </h4>

                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-slate-400 light:text-slate-600">
                    <Building className="w-3 h-3 text-brand-emerald shrink-0" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-white/5 light:border-slate-200">
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {cert.skills.slice(0, 2).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dark-bg light:bg-slate-100 text-slate-300 light:text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                    {cert.skills.length > 2 && (
                      <span className="text-[9px] font-mono px-1 py-0.5 text-slate-500">
                        +{cert.skills.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Certificate Button Strip */}
                  {hasCert && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1">
                        {isMultiCert ? (
                          <Layers className="w-3 h-3 text-brand-cyan" />
                        ) : (
                          <FileCheck className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>{isMultiCert ? `${cert.certificateImages?.length} Certs` : 'Verified Cert'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCertificate(cert);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.8 rounded text-[10px] font-mono font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Cert</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More Toggle Button */}
        {filteredCerts.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-dark-card light:bg-slate-100 hover:bg-dark-card-hover text-slate-300 light:text-slate-800 border border-white/10 light:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{showAll ? 'Show Less' : `View All ${filteredCerts.length} Certifications`}</span>
              {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Certifications;

