import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GitBranch,
  ExternalLink,
  FolderGit2,
  Star,
  GitFork,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  PlusCircle,
} from 'lucide-react';
import { GithubIcon } from './Icons';
import { PERSONAL_INFO } from '../data/portfolioData';

interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  pushed_at: string;
  homepage?: string | null;
  fork: boolean;
}

interface DisplayRepo {
  id: string | number;
  name: string;
  description: string;
  language: string;
  tag: string;
  color: string;
  stars: number;
  forks: number;
  url: string;
  demoUrl?: string;
  topics: string[];
  updatedAt?: string;
  isLiveSynced?: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: 'text-cyan-400',
  'C++': 'text-amber-400',
  C: 'text-amber-300',
  Java: 'text-rose-400',
  PHP: 'text-violet-400',
  TypeScript: 'text-blue-400',
  JavaScript: 'text-amber-300',
  HTML: 'text-orange-400',
  CSS: 'text-pink-400',
  Shell: 'text-emerald-400',
};

export function GitHubPresence() {
  const [liveRepos, setLiveRepos] = useState<DisplayRepo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchGitHubRepositories = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch(
        `https://api.github.com/users/${PERSONAL_INFO.githubUsername}/repos?sort=updated&per_page=100`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.ok) {
        const apiData: GitHubApiRepo[] = await response.json();
        
        // Transform real fetched repos directly from GitHub account
        const fetchedDisplayRepos: DisplayRepo[] = apiData.map((repo) => {
          const lang = repo.language || 'Code';
          const color = LANGUAGE_COLORS[lang] || 'text-brand-cyan';
          
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description || 'Public GitHub repository by @' + PERSONAL_INFO.githubUsername,
            language: lang,
            tag: repo.topics?.[0] || (repo.fork ? 'Forked' : 'Repository'),
            color: color,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            demoUrl: repo.homepage || undefined,
            topics: repo.topics || [],
            updatedAt: repo.pushed_at || repo.updated_at,
            isLiveSynced: true,
          };
        });

        setLiveRepos(fetchedDisplayRepos);
        setLastSynced(new Date());
      } else {
        // In case of API rate limit or other non-200 response
        setErrorMsg('GitHub API rate limited or temporarily unavailable.');
        setLastSynced(new Date());
      }
    } catch {
      setErrorMsg('Network error while connecting to GitHub.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch live repositories on component mount
  useEffect(() => {
    fetchGitHubRepositories();
  }, [fetchGitHubRepositories]);

  // Extract unique languages for filter tabs
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    liveRepos.forEach((r) => {
      if (r.language) {
        langs.add(r.language);
      }
    });
    return ['all', ...Array.from(langs)];
  }, [liveRepos]);

  // Filter repositories
  const filteredRepos = useMemo(() => {
    return liveRepos.filter((repo) => {
      // Language filter
      if (selectedLanguage !== 'all' && repo.language !== selectedLanguage) {
        return false;
      }

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = repo.name.toLowerCase().includes(q);
        const matchDesc = repo.description.toLowerCase().includes(q);
        const matchLang = repo.language.toLowerCase().includes(q);
        const matchTopic = repo.topics.some((t) => t.toLowerCase().includes(q));
        return matchName || matchDesc || matchLang || matchTopic;
      }

      return true;
    });
  }, [liveRepos, selectedLanguage, searchQuery]);

  // Visible repos: Display 4 initially, then expand with "Show More"
  const displayedRepos = showAll ? filteredRepos : filteredRepos.slice(0, 4);

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="card-cyber p-5 sm:p-7 border-white/10 light:border-slate-200">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10 light:border-slate-200">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-brand-blue-glow font-semibold uppercase tracking-wider mb-1">
                <div className="flex items-center gap-1">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  <span>LIVE GITHUB ECOSYSTEM</span>
                </div>
                <span>•</span>
                <span className="text-brand-cyan">@{PERSONAL_INFO.githubUsername}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE SYNCED
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white light:text-slate-900 tracking-tight">
                Original GitHub Repositories
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 light:text-slate-600 mt-0.5">
                Directly connected to GitHub API. Any new repository created on <strong className="text-slate-200 light:text-slate-800">@{PERSONAL_INFO.githubUsername}</strong> automatically updates here in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Manual Refresh Trigger */}
              <button
                onClick={fetchGitHubRepositories}
                disabled={isLoading}
                title="Fetch latest repositories from GitHub"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-dark-bg/80 light:bg-slate-100 hover:bg-dark-card border border-white/10 text-slate-300 light:text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-cyan' : ''}`} />
                <span>{isLoading ? 'Syncing...' : 'Sync GitHub'}</span>
              </button>

              {/* Profile Link CTA */}
              <a
                href={PERSONAL_INFO.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-gradient-to-r from-brand-blue to-brand-cyan text-white hover:opacity-95 shadow-sm transition-all"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Search & Filter Controls (Rendered when repos exist) */}
          {liveRepos.length > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
              {/* Language filter pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-brand-blue/20 text-brand-cyan border border-brand-blue/40 font-semibold'
                        : 'bg-dark-bg/60 light:bg-slate-100 text-slate-400 light:text-slate-600 hover:text-white border border-white/5 light:border-slate-200'
                    }`}
                  >
                    {lang === 'all' ? `All Repos (${liveRepos.length})` : lang}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search repository or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 rounded-lg text-xs font-mono bg-dark-bg/80 light:bg-white border border-white/10 light:border-slate-300 text-slate-200 light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          )}

          {/* Repositories Responsive Grid */}
          {displayedRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3.5">
              {displayedRepos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-dark-bg/70 light:bg-slate-50 border border-white/5 light:border-slate-200 hover:border-brand-blue/50 hover:shadow-lg hover:shadow-brand-blue/10 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Meta */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-white light:text-slate-900 flex items-center gap-1.5 group-hover:text-brand-cyan transition-colors truncate">
                        <GitBranch className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                        <span className="truncate">{repo.name}</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand-cyan/15 text-brand-cyan shrink-0 border border-brand-cyan/30">
                        {repo.tag}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed line-clamp-2 mb-3">
                      {repo.description}
                    </p>

                    {/* Topics Pills */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {repo.topics.slice(0, 3).map((topic, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-dark-card light:bg-slate-200 text-slate-400 light:text-slate-700"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Stats & Links */}
                  <div className="pt-2.5 border-t border-white/5 light:border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 font-semibold ${repo.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {repo.language}
                      </span>
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400/40" />
                          {repo.stars}
                        </span>
                      )}
                      {repo.forks > 0 && (
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <GitFork className="w-3 h-3" />
                          {repo.forks}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {repo.demoUrl && (
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(repo.demoUrl, '_blank');
                          }}
                          className="text-emerald-400 hover:underline flex items-center gap-0.5"
                        >
                          Demo <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                      <span className="text-slate-500 group-hover:text-brand-cyan transition-colors flex items-center gap-0.5">
                        View Repository <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-6 h-6 animate-spin text-brand-cyan mx-auto mb-2" />
              <p className="text-xs font-mono text-slate-400">Fetching live repositories from GitHub API...</p>
            </div>
          ) : (
            <div className="py-10 text-center rounded-xl bg-dark-bg/40 border border-white/5 p-6">
              <PlusCircle className="w-8 h-8 text-brand-cyan/60 mx-auto mb-2" />
              <h4 className="font-display font-semibold text-sm text-white">Live GitHub Repositories Active</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Connected to <strong className="text-brand-cyan">github.com/{PERSONAL_INFO.githubUsername}</strong>. Whenever you create new repositories on GitHub, they will appear here automatically without altering the page layout.
              </p>
            </div>
          )}

          {/* Show More / Show Less Toggle Button (Appears when > 4 repositories exist) */}
          {filteredRepos.length > 4 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-dark-bg/80 light:bg-slate-100 hover:bg-dark-card text-slate-300 light:text-slate-800 border border-white/10 light:border-slate-300 transition-colors cursor-pointer"
              >
                <span>
                  {showAll
                    ? 'Show Less'
                    : `Show More (${filteredRepos.length - 4} More Repositories)`}
                </span>
                {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          {/* Sync Timestamp Footer */}
          <div className="mt-5 pt-4 border-t border-white/10 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {errorMsg
                ? errorMsg
                : `Live sync active for @${PERSONAL_INFO.githubUsername} • Auto-expands after 4 with Show More`}
            </span>
            {lastSynced && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                Last Synced: {lastSynced.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GitHubPresence;
