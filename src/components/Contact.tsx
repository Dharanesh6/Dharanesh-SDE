import { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  MessageSquare,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from './Icons';
import { PERSONAL_INFO } from '../data/portfolioData';

export function Contact() {
  const [copied, setCopied] = useState<boolean>(false);
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.social.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !message.trim()) return;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${senderName}`);
    const body = encodeURIComponent(
      `Hi Dharanesh,\n\n${message}\n\nFrom: ${senderName} (${senderEmail})`
    );
    window.location.href = `mailto:${PERSONAL_INFO.social.email}?subject=${subject}&body=${body}`;

    setSentStatus('Opening email client...');
    setTimeout(() => setSentStatus(null), 4000);
  };

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan-glow light:text-brand-cyan font-mono text-xs uppercase tracking-wider mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>10 // GET IN TOUCH</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            Let's Build Something Together
          </h2>
          <p className="mt-1.5 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-lg">
            Open for SDE, AI engineering opportunities, and technical collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Direct Contact & Quick Copy */}
          <div className="lg:col-span-5 card-cyber p-5 sm:p-7 flex flex-col justify-between border-brand-cyan/30">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-brand-cyan font-semibold block mb-1">
                Direct Communication
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-white light:text-slate-900 mb-2">
                Fastest Way to Reach Me
              </h3>
              <p className="text-xs text-slate-300 light:text-slate-600 leading-relaxed mb-5">
                Whether you're exploring technical opportunities or discussing engineering architectures, feel free to connect directly.
              </p>

              {/* One-Click Copy Email Card */}
              <div className="p-3.5 rounded-xl bg-dark-bg/80 light:bg-slate-50 border border-white/10 light:border-slate-200 mb-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="p-2 rounded-lg bg-brand-blue/20 text-brand-cyan shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-slate-400 block">Email Address</span>
                      <span className="font-mono text-xs font-semibold text-white light:text-slate-900 truncate">
                        {PERSONAL_INFO.social.email}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-dark-card light:bg-white border border-white/10 light:border-slate-300 hover:border-brand-cyan text-slate-300 light:text-slate-700 hover:text-brand-cyan transition-colors shrink-0 cursor-pointer"
                    aria-label="Copy email address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-[10px] font-mono text-emerald-400 mt-2 text-right">
                    ✓ Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Social Channels */}
              <div className="space-y-2">
                <a
                  href={PERSONAL_INFO.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-dark-bg/50 light:bg-slate-50 border border-white/5 light:border-slate-200 flex items-center justify-between text-xs text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:border-brand-blue/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <GithubIcon className="w-4 h-4 text-brand-cyan" />
                    <span className="font-mono">GitHub Profile</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href={PERSONAL_INFO.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-dark-bg/50 light:bg-slate-50 border border-white/5 light:border-slate-200 flex items-center justify-between text-xs text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:border-brand-blue/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <LinkedinIcon className="w-4 h-4 text-brand-blue" />
                    <span className="font-mono">LinkedIn Network</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </a>

                <a
                  href={PERSONAL_INFO.social.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-dark-bg/50 light:bg-slate-50 border border-white/5 light:border-slate-200 flex items-center justify-between text-xs text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <LeetCodeIcon className="w-4 h-4 text-amber-400" />
                    <span className="font-mono">LeetCode Problem Solving</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-brand-violet" />
              <span>{PERSONAL_INFO.location}</span>
            </div>
          </div>

          {/* Right Column: Direct Message Form */}
          <div className="lg:col-span-7 card-cyber p-5 sm:p-7 border-brand-blue/30">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-brand-blue-glow" />
              <h3 className="font-display font-bold text-lg text-white light:text-slate-900">
                Send a Direct Message
              </h3>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-dark-bg/80 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs font-mono text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@example.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-dark-bg/80 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs font-mono text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Message
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about the role, project, or collaboration..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-bg/80 light:bg-slate-50 border border-white/10 light:border-slate-300 text-xs font-mono text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-slate-400">
                  {sentStatus && <span className="text-emerald-400">{sentStatus}</span>}
                </span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-mono text-xs font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-95 shadow-md shadow-brand-blue/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
