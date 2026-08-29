import { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Maximize2,
  Minimize2,
  ArrowRight,
  ExternalLink,
  Terminal,
  Key,
  Check,
  Zap,
} from 'lucide-react';
import {
  getDharaneshAIResponse,
  SUGGESTED_PROMPTS,
  type ChatMessage,
} from '../utils/dharaneshAiEngine';
import { PERSONAL_INFO } from '../data/portfolioData';
import { resolveAssetUrl, resolveWebpUrl } from '../utils/assetUrl';

interface DharaneshAIChatProps {
  onScrollToSection?: (sectionId: string) => void;
}

export function DharaneshAIChat({ onScrollToSection }: DharaneshAIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('dk_gemini_key') || '';
    } catch {
      return '';
    }
  });
  const [hasSavedKey, setHasSavedKey] = useState(() => {
    try {
      return Boolean(localStorage.getItem('dk_gemini_key'));
    } catch {
      return false;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `👋 **Hi there! I'm Dharanesh AI**, your personal recruiter & engineering assistant.\n\n` +
        `I operate with **First-Priority Ground Truth Rules** directly linked to Dharanesh's portfolio data:\n\n` +
        `* 🚀 **8+ Systems Built** (IoT Telematics, Novel Nest, SRPTC Portals, Computer Vision)\n` +
        `* 🏆 **7 Verified Prize Awards** (1st Prize Code Busters @ KGiSL, 1st Prize Code Debugging @ SRPTC, Vedic Math Quiz)\n` +
        `* 📜 **25+ Industry Certifications** (GenAI, OpenTelemetry, OWASP, Python, Java)\n` +
        `* 🎓 **Education at KCT & SRPTC** with top distinction\n\n` +
        `What would you like to explore? Ask me anything or click a prompt below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: '💼 Recruiter 60-Sec Summary', actionType: 'scroll', target: 'about' },
        { label: '🚀 Top Projects', actionType: 'scroll', target: 'projects' },
        { label: '🏆 Verified Awards', actionType: 'scroll', target: 'achievements' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for external open trigger
  useEffect(() => {
    const handleOpenExternal = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-dharanesh-ai', handleOpenExternal);
    return () => window.removeEventListener('open-dharanesh-ai', handleOpenExternal);
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setShowNotificationBadge(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Save API Key
  const handleSaveApiKey = () => {
    try {
      if (apiKeyInput.trim()) {
        localStorage.setItem('dk_gemini_key', apiKeyInput.trim());
        setHasSavedKey(true);
      } else {
        localStorage.removeItem('dk_gemini_key');
        setHasSavedKey(false);
      }
      setShowApiKeyModal(false);
    } catch {}
  };

  // Handle Action Click (e.g. scroll to section or open link)
  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[0]) => {
    if (action.actionType === 'scroll') {
      const targetId = action.target;
      if (onScrollToSection) {
        onScrollToSection(targetId);
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    } else if (action.actionType === 'link') {
      window.open(action.target, '_blank', 'noopener,noreferrer');
    }
  };

  // Submit User Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    setHasInteracted(true);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await getDharaneshAIResponse(text, messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: response.actions,
        isApiPowered: response.isApiPowered,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat generation error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'ai',
        text: `✨ Conversation reset! Ask me anything about Dharanesh's projects, awards, certifications, or hiring availability.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: '💼 Recruiter Pitch', actionType: 'scroll', target: 'about' },
          { label: '🚀 Explore Projects', actionType: 'scroll', target: 'projects' },
        ],
      },
    ]);
  };

  const avatarJpg = resolveAssetUrl(PERSONAL_INFO.avatarUrl || '/profile.jpg');
  const avatarWebp = resolveWebpUrl(PERSONAL_INFO.avatarWebp || '/profile.webp');

  // Simple parser to render markdown bolding and bullet lists
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-display font-bold text-sm sm:text-base text-brand-cyan-glow mt-2 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-violet-glow" />
            <span>{line.replace('### ', '')}</span>
          </h4>
        );
      }
      // Header 4 or bold sub-title
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={idx} className="font-semibold text-white light:text-slate-900 mt-2 mb-1 text-xs sm:text-sm">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      // Bullet list item
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.substring(2);
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 text-slate-200 light:text-slate-700 text-xs sm:text-sm leading-relaxed pl-1">
            <span className="text-brand-cyan font-bold mt-0.5">•</span>
            <span>{parseInlineMarkdown(content)}</span>
          </div>
        );
      }
      // Numbered list item
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 text-slate-200 light:text-slate-700 text-xs sm:text-sm leading-relaxed pl-1">
            <span className="text-brand-violet-glow font-mono font-semibold">{line.split('.')[0]}.</span>
            <span>{parseInlineMarkdown(line.replace(/^\d+\.\s*/, ''))}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-slate-300 light:text-slate-700 text-xs sm:text-sm leading-relaxed my-1">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  const parseInlineMarkdown = (text: string) => {
    const parts = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      const codeMatch = remaining.match(/`([^`]+)`/);

      const matches = [
        linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
        boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
        codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
      ].filter(Boolean).sort((a, b) => a!.index - b!.index);

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches[0]!;
      if (first.index > 0) {
        parts.push(remaining.substring(0, first.index));
      }

      if (first.type === 'link') {
        parts.push(
          <a
            key={keyIdx++}
            href={first.match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-cyan hover:underline font-medium inline-flex items-center gap-0.5"
          >
            {first.match[1]}
            <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        );
      } else if (first.type === 'bold') {
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-white light:text-slate-900">
            {first.match[1]}
          </strong>
        );
      } else if (first.type === 'code') {
        parts.push(
          <code key={keyIdx++} className="px-1.5 py-0.5 rounded bg-white/10 light:bg-slate-200 text-brand-cyan font-mono text-[11px]">
            {first.match[1]}
          </code>
        );
      }

      remaining = remaining.substring(first.index + first.match[0].length);
    }

    return parts;
  };

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING TRIGGER BUTTON (BOTTOM RIGHT) */}
      {/* ========================================================= */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
          {!hasInteracted && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-card/95 light:bg-white/95 border border-brand-blue/40 shadow-xl backdrop-blur-md animate-bounce pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono text-slate-200 light:text-slate-800 font-medium">
                Ask Dharanesh AI 🤖
              </span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Ask Dharanesh AI Assistant"
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-brand-blue via-brand-violet to-brand-cyan p-[2px] shadow-2xl shadow-brand-blue/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan blur-md opacity-75 group-hover:opacity-100 animate-pulse transition-opacity pointer-events-none" />

            <div className="relative w-full h-full rounded-full bg-dark-bg overflow-hidden flex items-center justify-center">
              <picture>
                {avatarWebp && <source srcSet={avatarWebp} type="image/webp" />}
                <img
                  src={avatarJpg}
                  alt="Dharanesh AI"
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                />
              </picture>
            </div>

            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-violet border-2 border-dark-bg flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-2.5 h-2.5 animate-spin text-brand-cyan" />
            </div>

            {showNotificationBadge && (
              <span className="absolute top-0 left-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-dark-bg"></span>
              </span>
            )}
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* EXPANDED AI CHAT MODAL */}
      {/* ========================================================= */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-3 sm:inset-6 max-w-4xl max-h-[92vh] mx-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] md:w-[460px] h-[85vh] sm:h-[620px] max-h-[90vh]'
          } rounded-2xl flex flex-col overflow-hidden border border-brand-blue/40 bg-dark-bg/95 light:bg-white/95 backdrop-blur-xl shadow-2xl shadow-brand-blue/30`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 light:border-slate-200 bg-gradient-to-r from-dark-card/90 via-dark-surface/90 to-dark-card/90 light:from-slate-100 light:to-white">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue via-brand-violet to-brand-cyan p-[1.5px] shadow-sm shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-dark-bg">
                  <picture>
                    {avatarWebp && <source srcSet={avatarWebp} type="image/webp" />}
                    <img
                      src={avatarJpg}
                      alt="Dharanesh AI"
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-dark-bg" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm text-white light:text-slate-900 leading-tight">
                    Ask Dharanesh AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-brand-violet/20 text-brand-violet-glow border border-brand-violet/30 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-brand-cyan" />
                    <span>{hasSavedKey ? 'Gemini 2.0' : 'Ground-Truth'}</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 light:text-slate-500">
                  Strict Rule Knowledge Base & Portfolio AI
                </p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowApiKeyModal((prev) => !prev)}
                title={hasSavedKey ? 'API Key Configured (Gemini 2.0 Flash)' : 'Configure Gemini API Key'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  hasSavedKey
                    ? 'text-brand-cyan bg-brand-cyan/10 hover:bg-brand-cyan/20'
                    : 'text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10'
                }`}
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                title={isExpanded ? 'Collapse size' : 'Expand size'}
                className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* API Key Configuration Drawer */}
          {showApiKeyModal && (
            <div className="p-3 bg-dark-card border-b border-brand-violet/30 text-xs space-y-2 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between text-slate-200 font-mono">
                <span className="font-semibold text-brand-cyan flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Optional Gemini API Key
                </span>
                <span className="text-[10px] text-slate-400">Default: High-Speed Ground Truth</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Enter your Google Gemini API key to enable live Gemini 2.0 Flash reasoning. Without a key, the AI uses its built-in portfolio ground-truth engine.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 bg-dark-bg border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-violet text-white font-mono font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan p-[1px] shrink-0 mt-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-dark-bg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-brand-cyan" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 shadow-md ${
                      isAi
                        ? 'bg-dark-card/90 light:bg-slate-100 border border-white/10 light:border-slate-300 text-slate-100 light:text-slate-900'
                        : 'bg-gradient-to-r from-brand-blue to-brand-violet text-white font-medium ml-auto'
                    }`}
                  >
                    {/* Message Body */}
                    <div className="space-y-1">
                      {isAi ? renderFormattedText(msg.text) : <p className="text-xs sm:text-sm">{msg.text}</p>}
                    </div>

                    {/* Interactive Action Pills */}
                    {isAi && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-white/10 light:border-slate-200">
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleActionClick(act)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-brand-blue/15 hover:bg-brand-blue/30 border border-brand-blue/30 text-brand-cyan hover:text-white transition-all cursor-pointer shadow-sm"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Timestamp & Engine Indicator */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 light:text-slate-500 mt-1 opacity-70">
                      <span>{msg.isApiPowered ? '⚡ Gemini 2.0 Flash' : '🎯 Ground-Truth Engine'}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 mb-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pl-9">
                <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-dark-card border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-slate-300">Dharanesh AI is consulting ground-truth knowledge...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Suggestions */}
          <div className="px-3 py-2 border-t border-white/10 light:border-slate-200 bg-dark-surface/50 light:bg-slate-50">
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-brand-cyan" />
              <span>Priority Inquiries:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSendMessage(p.text)}
                  disabled={isTyping}
                  className="shrink-0 px-2.5 py-1 rounded-full text-xs font-mono bg-dark-card/90 light:bg-white border border-brand-blue/30 text-slate-300 light:text-slate-700 hover:border-brand-cyan hover:text-brand-cyan transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-white/10 light:border-slate-200 bg-dark-card light:bg-white flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about projects, awards, skills, or hiring..."
              disabled={isTyping}
              className="flex-1 bg-dark-bg light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-blue to-brand-violet text-white font-mono text-xs sm:text-sm font-semibold shadow-md shadow-brand-blue/20 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default DharaneshAIChat;
