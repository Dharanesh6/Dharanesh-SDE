import { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  Code2,
  Terminal,
  Layers,
  Sparkles,
  Award,
  Briefcase,
  Mail,
  User,
  Compass,
  Cpu,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  activeSection: string;
}

// Streamlined top navigation items for desktop
const DESKTOP_NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Roadmap' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'ai-lab', label: 'AI Lab' },
  { id: 'achievements', label: 'Awards' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const ALL_NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: Terminal },
  { id: 'about', label: 'About', icon: User },
  { id: 'journey', label: 'Roadmap', icon: Compass },
  { id: 'build', label: 'Matrix', icon: Layers },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Cpu },
  { id: 'ai-lab', label: 'AI Lab', icon: Sparkles },
  { id: 'achievements', label: 'Awards', icon: Award },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export function Navbar({ isDark, onToggleTheme, activeSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 70;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'glass-nav py-2 shadow-md'
          : 'bg-transparent py-3.5'
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <button
          onClick={() => scrollToSection('hero')}
          className="group flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg p-0.5 cursor-pointer"
          aria-label="Go to top"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue via-brand-violet to-brand-cyan p-[1px] shadow-sm">
            <div className="w-full h-full rounded-[7px] bg-dark-bg flex items-center justify-center font-mono font-bold text-xs tracking-wider text-white group-hover:bg-dark-surface transition-colors">
              DK<span className="text-brand-cyan animate-pulse">_</span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display font-bold text-xs tracking-tight text-slate-100 light:text-slate-900 group-hover:text-brand-blue transition-colors">
              {PERSONAL_INFO.name}
            </span>
            <span className="text-[10px] font-mono text-brand-cyan/90">
              SDE + AI Engineer
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/10 bg-dark-surface/80 backdrop-blur-md light:border-slate-200 light:bg-white/90 shadow-sm">
          {DESKTOP_NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 focus:outline-none cursor-pointer ${isActive
                    ? 'text-white bg-gradient-to-r from-brand-blue to-brand-violet shadow-sm shadow-brand-blue/20'
                    : 'text-slate-400 hover:text-slate-100 light:text-slate-600 light:hover:text-slate-900 hover:bg-white/5 light:hover:bg-slate-100'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg border border-white/10 light:border-slate-300/80 bg-dark-surface/60 light:bg-white/90 text-slate-300 light:text-slate-700 hover:text-brand-cyan hover:border-brand-cyan/40 transition-all duration-200 focus:outline-none cursor-pointer"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-brand-violet" />
            )}
          </button>

          {/* Quick Connect CTA */}
          <button
            onClick={() => scrollToSection('contact')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-mono rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan text-white hover:opacity-95 shadow-sm transition-all cursor-pointer"
          >
            <Mail className="w-3 h-3" />
            <span>Connect</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-white/10 bg-dark-surface/60 light:bg-white/90 text-slate-300 light:text-slate-700 hover:text-brand-cyan transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[56px] bg-dark-bg/95 light:bg-slate-50/98 backdrop-blur-2xl border-b border-white/10 p-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {ALL_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all cursor-pointer ${isActive
                      ? 'bg-brand-blue/20 border border-brand-blue/40 text-brand-cyan font-semibold'
                      : 'bg-dark-surface/50 light:bg-white/80 border border-white/5 light:border-slate-200 text-slate-300 light:text-slate-700'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              SDE + AI Engineer
            </span>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-2.5 py-1 rounded-md bg-brand-blue text-white text-[11px] font-mono cursor-pointer"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
