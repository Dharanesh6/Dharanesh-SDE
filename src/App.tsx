import { useState, useEffect } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Journey } from './components/Journey';
import { WhatIBuild } from './components/WhatIBuild';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { AILab } from './components/AILab';
import { AILabStudio } from './components/AILabStudio';
import { EngineeringStats } from './components/EngineeringStats';
import { AchievementWall } from './components/AchievementWall';
import { Certifications } from './components/Certifications';
import { Experience } from './components/Experience';
import { CurrentlyExploring } from './components/CurrentlyExploring';
import { GitHubPresence } from './components/GitHubPresence';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CertificateModal } from './components/CertificateModal';
import type { CertificateModalData } from './types/portfolio';

export function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('dk_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateModalData | null>(null);
  const [studioExpId, setStudioExpId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#ai-studio')) {
      const exp = window.location.hash.replace('#ai-studio-', '').replace('#ai-studio', '');
      return exp || 'gesture-volume';
    }
    return null;
  });

  // Listen for hash changes (for standalone studio tabs)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#ai-studio')) {
        const exp = window.location.hash.replace('#ai-studio-', '').replace('#ai-studio', '');
        setStudioExpId(exp || 'gesture-volume');
      } else if (studioExpId && !window.location.hash.startsWith('#ai-studio')) {
        setStudioExpId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [studioExpId]);

  // Synchronize dark/light theme class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('dk_theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('dk_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // ScrollSpy observer to update active section in navbar
  useEffect(() => {
    if (studioExpId) return;

    const sectionIds = [
      'hero',
      'about',
      'journey',
      'build',
      'skills',
      'projects',
      'ai-lab',
      'achievements',
      'experience',
      'contact',
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [studioExpId]);

  // Subtle & Professional Section Scroll-In Observer (Cohesive section fade, no repetitive card jumps)
  useEffect(() => {
    if (studioExpId) return;

    const sections = document.querySelectorAll('main > section, main > div');

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.04,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    sections.forEach((sec) => {
      sec.classList.add('section-fade-in');
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30) {
        sec.classList.add('is-visible');
      } else {
        observer.observe(sec);
      }
    });

    return () => observer.disconnect();
  }, [studioExpId]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 70;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  // If in dedicated Fullscreen Studio mode (from URL hash or new tab launcher)
  if (studioExpId) {
    return (
      <AILabStudio
        initialExpId={studioExpId}
        onExit={() => {
          setStudioExpId(null);
          try {
            window.history.pushState(null, '', window.location.pathname + window.location.search);
          } catch {}
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen relative selection:bg-brand-blue/30 selection:text-brand-cyan ${isDark ? 'bg-[#070A12] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* Interactive Background Neural Nodes Network */}
      <BackgroundCanvas isDark={isDark} />

      {/* Sticky Glassmorphic Navigation */}
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Hero Section */}
        <Hero
          onExploreProjects={() => scrollTo('projects')}
          onExploreSkills={() => scrollTo('skills')}
          onExploreAILab={() => scrollTo('ai-lab')}
        />

        {/* 2. Engineering Stats Highlights */}
        <EngineeringStats />

        {/* 3. About Section */}
        <About />

        {/* 4. Journey & Roadmap (Diploma 2026 -> KCT B.Tech IT -> SDE/AI) */}
        <Journey />

        {/* 5. What I Build Matrix */}
        <WhatIBuild />

        {/* 6. Technical Skills Cluster */}
        <Skills />

        {/* 7. Major Systems & Flagship Project (SafeGuard + Campus Help Desk) */}
        <Projects />

        {/* 8. Interactive AI & CV Lab Workspace */}
        <AILab
          onOpenStudio={(expId) => {
            setStudioExpId(expId);
            try {
              window.history.pushState({ studio: expId }, '', '#ai-studio-' + expId);
            } catch {}
          }}
        />

        {/* 9. Verified Achievement Wall & Symposiums */}
        <AchievementWall
          onViewCertificate={(cert) => setSelectedCertificate(cert)}
        />

        {/* 10. Searchable & Categorized Certifications Library */}
        <Certifications
          onViewCertificate={(cert) => setSelectedCertificate(cert)}
        />

        {/* 11. Experience, Internship & Technical Leadership */}
        <Experience
          onViewCertificate={(cert) => setSelectedCertificate(cert)}
        />

        {/* 12. Active Exploration & Open Source Repositories */}
        <CurrentlyExploring />
        <GitHubPresence />

        {/* 13. Contact & Direct Connection Gateway */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Certificate High-Resolution Modal Viewer */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}

export default App;

