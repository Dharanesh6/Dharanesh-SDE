import { useState, useEffect, useRef, useCallback } from 'react';
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
  Copy,
  ThumbsUp,
  Square,
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
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
      text: `👋 **Hi there! I'm Dharanesh K**, Software Development & AI Engineer.\n\n` +
        `Ask me anything about my **8+ major systems (IoT, Java NLP, PHP/MySQL, Computer Vision)**, my **7 verified State & National prize awards**, my **9.78 CGPA (Top Distinction)** in Diploma in CSE, or my **25+ industry certifications**!\n\n` +
        `How can I assist you with your hiring or technical review today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: '💼 Why Should You Hire Me?', actionType: 'scroll', target: 'about' },
        { label: '🚀 Explore My Projects', actionType: 'scroll', target: 'projects' },
        { label: '🏆 View My Awards', actionType: 'scroll', target: 'achievements' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const abortControllerRef = useRef<{ isAborted: boolean }>({ isAborted: false });

  // External open trigger
  useEffect(() => {
    const handleOpenExternal = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-dharanesh-ai', handleOpenExternal);
    return () => window.removeEventListener('open-dharanesh-ai', handleOpenExternal);
  }, []);

  // Smooth scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isStreaming, isOpen, scrollToBottom]);

  // Focus on open
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

  // Copy message text
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Like / Feedback
  const handleToggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Stop Generation
  const handleStopGenerating = () => {
    abortControllerRef.current.isAborted = true;
    setIsStreaming(false);
    setIsTyping(false);
  };

  // Handle Action Click
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

  // Stream text token by token for authentic ChatGPT feel
  const streamTokens = (
    fullText: string,
    messageId: string,
    actions?: ChatMessage['actions'],
    isApiPowered?: boolean
  ) => {
    setIsStreaming(true);
    abortControllerRef.current = { isAborted: false };

    // Split text by words for natural streaming cadence
    const words = fullText.split(' ');
    let currentIndex = 0;
    let accumulatedText = '';

    const streamInterval = setInterval(() => {
      if (abortControllerRef.current.isAborted || currentIndex >= words.length) {
        clearInterval(streamInterval);
        setIsStreaming(false);
        setIsTyping(false);
        // Ensure complete text is set when stream finishes
        if (!abortControllerRef.current.isAborted) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, text: fullText, actions, isApiPowered }
                : msg
            )
          );
        }
        return;
      }

      // Add 1 to 2 words per tick
      const chunk = words.slice(currentIndex, currentIndex + 2).join(' ') + ' ';
      accumulatedText += chunk;
      currentIndex += 2;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, text: accumulatedText }
            : msg
        )
      );
    }, 28); // ~35 words per second (ChatGPT-like stream rate)
  };

  // Submit User Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping || isStreaming) return;

    setHasInteracted(true);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg, initialAiMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await getDharaneshAIResponse(text, messages);

      // Stream the response smoothly token-by-token
      streamTokens(response.text, aiMsgId, response.actions, response.isApiPowered);
    } catch (err) {
      console.error('Chat generation error:', err);
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.text);
    }
  };

  // Reset conversation
  const handleResetChat = () => {
    handleStopGenerating();
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'ai',
        text: `✨ **Conversation reset!** Ask me anything about my projects, 7 awards, 9.78 CGPA distinction, skills, or hiring availability.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: '💼 Why Should You Hire Me?', actionType: 'scroll', target: 'about' },
          { label: '🚀 Explore My Projects', actionType: 'scroll', target: 'projects' },
        ],
      },
    ]);
  };

  const avatarJpg = resolveAssetUrl(PERSONAL_INFO.avatarUrl || '/profile.jpg');
  const avatarWebp = resolveWebpUrl(PERSONAL_INFO.avatarWebp || '/profile.webp');

  // ChatGPT-style Markdown Renderer
  const renderFormattedText = (raw: string, isMessageStreaming: boolean) => {
    if (!raw && isMessageStreaming) {
      return (
        <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span>Thinking through portfolio knowledge...</span>
        </span>
      );
    }

    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          // Header 3
          if (line.startsWith('### ')) {
            return (
              <h4
                key={idx}
                className="font-display font-bold text-sm sm:text-base text-brand-cyan-glow mt-2.5 mb-1.5 flex items-center gap-1.5 border-b border-brand-cyan/20 pb-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-violet-glow" />
                <span>{line.replace('### ', '')}</span>
              </h4>
            );
          }
          // Header 4 or bold sub-title
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={idx} className="font-semibold text-white light:text-slate-900 mt-2 mb-1">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          // Bullet list item
          if (line.startsWith('* ') || line.startsWith('- ')) {
            const content = line.substring(2);
            return (
              <div
                key={idx}
                className="flex items-start gap-2 my-1 text-slate-200 light:text-slate-700 pl-1"
              >
                <span className="text-brand-cyan font-bold mt-0.5 select-none">•</span>
                <span className="flex-1">{parseInlineMarkdown(content)}</span>
              </div>
            );
          }
          // Numbered list item
          if (/^\d+\.\s/.test(line)) {
            const number = line.match(/^(\d+)\./)?.[1] || '1';
            return (
              <div
                key={idx}
                className="flex items-start gap-2 my-1 text-slate-200 light:text-slate-700 pl-1"
              >
                <span className="text-brand-violet-glow font-mono font-semibold select-none">
                  {number}.
                </span>
                <span className="flex-1">{parseInlineMarkdown(line.replace(/^\d+\.\s*/, ''))}</span>
              </div>
            );
          }
          // Empty line
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }
          // Regular paragraph
          return (
            <p key={idx} className="text-slate-300 light:text-slate-700 my-1">
              {parseInlineMarkdown(line)}
            </p>
          );
        })}
        {isMessageStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-brand-cyan animate-pulse rounded-xs align-middle" />
        )}
      </div>
    );
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
      ]
        .filter(Boolean)
        .sort((a, b) => a!.index - b!.index);

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
          <code
            key={keyIdx++}
            className="px-1.5 py-0.5 rounded bg-white/10 light:bg-slate-200 text-brand-cyan font-mono text-[11px]"
          >
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
      {/* CHATGPT-STYLE AI CHAT MODAL */}
      {/* ========================================================= */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-3 sm:inset-6 max-w-4xl max-h-[94vh] mx-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] md:w-[480px] h-[86vh] sm:h-[640px] max-h-[92vh]'
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
                    <span>{hasSavedKey ? 'Gemini 2.0' : 'ChatGPT Model'}</span>
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 light:text-slate-500">
                  Interactive Recruiter & Technical Assistant
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowApiKeyModal((prev) => !prev)}
                title={hasSavedKey ? 'API Key Configured' : 'Configure Gemini API Key'}
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

          {/* Optional API Key Drawer */}
          {showApiKeyModal && (
            <div className="p-3 bg-dark-card border-b border-brand-violet/30 text-xs space-y-2 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between text-slate-200 font-mono">
                <span className="font-semibold text-brand-cyan flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Optional Gemini API Key
                </span>
                <span className="text-[10px] text-slate-400">Default: Streaming Intelligence</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Enter your Google Gemini API key to enable live Gemini 2.0 Flash reasoning. Without a key, the assistant runs its built-in streaming intelligence engine.
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

          {/* ChatGPT-Style Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              const isCurrentStreamingMsg = isStreaming && index === messages.length - 1;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'items-start' : 'items-end justify-end'} group`}
                >
                  {/* AI Avatar */}
                  {isAi && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-blue to-brand-cyan p-[1px] shrink-0 mt-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden bg-dark-bg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-brand-cyan" />
                      </div>
                    </div>
                  )}

                  {/* Message Box */}
                  <div
                    className={`max-w-[88%] sm:max-w-[84%] rounded-2xl p-3.5 shadow-md ${
                      isAi
                        ? 'bg-dark-card/90 light:bg-slate-100 border border-white/10 light:border-slate-300 text-slate-100 light:text-slate-900'
                        : 'bg-gradient-to-r from-brand-blue via-brand-violet to-brand-blue text-white font-medium ml-auto'
                    }`}
                  >
                    {/* Content */}
                    <div>
                      {isAi
                        ? renderFormattedText(msg.text, isCurrentStreamingMsg)
                        : <p className="text-xs sm:text-sm whitespace-pre-wrap">{msg.text}</p>}
                    </div>

                    {/* Interactive Action Navigation Pills */}
                    {isAi && msg.actions && msg.actions.length > 0 && !isCurrentStreamingMsg && (
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

                    {/* ChatGPT Toolbar (Copy, Like, Timestamp) */}
                    {isAi && !isCurrentStreamingMsg && msg.text && (
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 light:text-slate-500 mt-2.5 pt-1.5 border-t border-white/5 light:border-slate-200">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            title="Copy response"
                            className="flex items-center gap-1 hover:text-brand-cyan transition-colors cursor-pointer p-0.5"
                          >
                            {copiedId === msg.id ? (
                              <span className="text-emerald-400 text-[10px] flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Copied
                              </span>
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>

                          <button
                            onClick={() => handleToggleLike(msg.id)}
                            title="Helpful response"
                            className={`p-0.5 transition-colors cursor-pointer ${
                              likedIds[msg.id] ? 'text-emerald-400' : 'hover:text-brand-cyan'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>

                          {index === messages.length - 1 && (
                            <button
                              onClick={handleRegenerate}
                              title="Regenerate answer"
                              className="hover:text-brand-cyan transition-colors cursor-pointer p-0.5"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <span className="opacity-70 text-[10px]">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {!isAi && (
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 mb-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Stop Generating Button Banner */}
          {isStreaming && (
            <div className="flex justify-center pb-2">
              <button
                onClick={handleStopGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-card border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-xs font-mono transition-colors shadow-lg cursor-pointer"
              >
                <Square className="w-3 h-3 fill-rose-400 text-rose-400" />
                <span>Stop generating</span>
              </button>
            </div>
          )}

          {/* Quick Starter Inquiry Chips */}
          <div className="px-3 py-2 border-t border-white/10 light:border-slate-200 bg-dark-surface/50 light:bg-slate-50">
            <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-brand-cyan" />
              <span>Explore Top Topics:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSendMessage(p.text)}
                  disabled={isTyping || isStreaming}
                  className="shrink-0 px-2.5 py-1 rounded-full text-xs font-mono bg-dark-card/90 light:bg-white border border-brand-blue/30 text-slate-300 light:text-slate-700 hover:border-brand-cyan hover:text-brand-cyan transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>

          {/* ChatGPT-Style Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-white/10 light:border-slate-200 bg-dark-card light:bg-white flex items-center gap-2"
          >
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about projects, 9.78 CGPA, awards, or hiring..."
              disabled={isTyping || isStreaming}
              className="flex-1 bg-dark-bg light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan transition-colors"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping || isStreaming}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue via-brand-violet to-brand-cyan text-white font-mono text-xs sm:text-sm font-semibold shadow-md shadow-brand-blue/20 hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
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
