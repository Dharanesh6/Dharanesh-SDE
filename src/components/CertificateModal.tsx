import { useState, useEffect, useRef } from 'react';
import {
  X,
  ExternalLink,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  Building,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { CertificateModalData } from '../types/portfolio';

interface CertificateModalProps {
  certificate: CertificateModalData | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Compile image list (primary image + any additionalImages)
  const imageList = certificate
    ? [
        {
          title: certificate.title,
          url: certificate.imageUrl,
          issuer: certificate.issuer,
        },
        ...(certificate.additionalImages || []).map((img) => ({
          title: img.title,
          url: img.url,
          issuer: img.issuer || certificate.issuer,
        })),
      ]
    : [];

  const currentImage = imageList[activeImageIndex] || imageList[0];

  // Reset zoom, position, and active tab when certificate changes
  useEffect(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setActiveImageIndex(0);
    setImageLoaded(false);
  }, [certificate]);

  // Keyboard shortcut support (Escape to close, +/- to zoom)
  useEffect(() => {
    if (!certificate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [certificate, onClose]);

  if (!certificate || !currentImage) return null;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.35, 0.75);
      if (next <= 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag-to-pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleOpenNewTab = () => {
    window.open(currentImage.url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.url;
    link.download = currentImage.url.split('/').pop() || 'certificate.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-7 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-dark-card/95 light:bg-white/95 rounded-2xl border border-white/15 light:border-slate-300 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-xl">
        {/* ========================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================= */}
        <div className="px-5 py-4 border-b border-white/10 light:border-slate-200 bg-dark-surface/80 light:bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED CREDENTIAL
              </span>

              {certificate.category && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 light:bg-slate-200 text-slate-400 light:text-slate-700">
                  {certificate.category}
                </span>
              )}

              {certificate.date && (
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {certificate.date}
                </span>
              )}
            </div>

            <h3
              id="certificate-modal-title"
              className="font-display font-bold text-base sm:text-lg text-white light:text-slate-900 truncate"
              title={currentImage.title}
            >
              {currentImage.title}
            </h3>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400 light:text-slate-600 font-mono truncate">
              <Building className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
              <span>{currentImage.issuer || certificate.issuer}</span>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-dark-bg/80 light:bg-slate-100 rounded-lg p-0.5 border border-white/10 light:border-slate-300 mr-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                title="Zoom Out (-)"
                className="p-1.5 text-slate-400 hover:text-white light:hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Reset Zoom (0)"
                className="px-2 py-1 text-[11px] font-mono text-slate-300 light:text-slate-700 hover:text-white rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.5}
                title="Zoom In (+)"
                className="p-1.5 text-slate-400 hover:text-white light:hover:text-slate-900 disabled:opacity-30 rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomLevel !== 1 && (
                <button
                  onClick={handleResetZoom}
                  title="Reset Position"
                  className="p-1.5 text-slate-400 hover:text-brand-cyan rounded hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Open in New Tab Button */}
            <button
              onClick={handleOpenNewTab}
              title="Open Certificate High-Res in New Tab"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-brand-blue/15 hover:bg-brand-blue/25 text-brand-cyan border border-brand-blue/30 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              title="Download Certificate File"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-dark-card hover:bg-dark-card-hover light:bg-slate-100 text-slate-300 light:text-slate-800 border border-white/10 light:border-slate-300 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close certificate modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-slate-200 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MULTI-CERTIFICATE SWITCHER TABS (If more than 1 image) */}
        {/* ========================================================= */}
        {imageList.length > 1 && (
          <div className="px-5 py-2.5 bg-dark-bg/60 light:bg-slate-100 border-b border-white/5 light:border-slate-200 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <Layers className="w-3.5 h-3.5 text-brand-cyan" />
              Certificates ({imageList.length}):
            </span>
            {imageList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImageIndex(idx);
                  setZoomLevel(1);
                  setPosition({ x: 0, y: 0 });
                  setImageLoaded(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-semibold shadow-sm shadow-emerald-500/10'
                    : 'bg-dark-card light:bg-white text-slate-400 hover:text-white border border-white/5 light:border-slate-300'
                }`}
              >
                {img.title.split('—')[0].split(':')[0].trim()}
                {img.issuer ? ` (${img.issuer.split(' ')[0]})` : ''}
              </button>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* IMAGE VIEWER CANVAS */}
        {/* ========================================================= */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleResetZoom}
          className={`relative flex-1 min-h-[350px] sm:min-h-[480px] max-h-[68vh] overflow-hidden bg-[#0A0D14] flex items-center justify-center p-4 select-none ${
            zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
        >
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Loading Spinner */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 font-mono text-xs z-10">
              <div className="w-8 h-8 rounded-full border-2 border-brand-cyan/30 border-t-brand-cyan animate-spin" />
              <span>Loading high-resolution certificate...</span>
            </div>
          )}

          {/* Certificate Image */}
          <img
            src={currentImage.url}
            alt={currentImage.title}
            onLoad={() => setImageLoaded(true)}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
              transition: isPanning ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
            }}
            className={`max-w-full max-h-[64vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />

          {/* Mobile Zoom Floating Bar */}
          <div className="sm:hidden absolute bottom-3 right-3 flex items-center gap-1 bg-dark-card/90 light:bg-white/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.75}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3.5}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODAL FOOTER */}
        {/* ========================================================= */}
        <div className="px-5 py-3 border-t border-white/10 light:border-slate-200 bg-dark-surface/90 light:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Verified Certificate from Best Student Award Record</span>
            </span>
            {certificate.skills && certificate.skills.length > 0 && (
              <div className="hidden md:flex items-center gap-1 ml-2 pl-2 border-l border-white/10">
                <span className="text-slate-500">Skills:</span>
                {certificate.skills.slice(0, 3).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.2 rounded bg-dark-bg light:bg-white border border-white/5 light:border-slate-200 text-slate-300 light:text-slate-700"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-slate-500 text-[11px] flex items-center gap-2">
            <span className="hidden sm:inline">Double-click to reset zoom</span>
            <span>•</span>
            <button
              onClick={handleOpenNewTab}
              className="text-brand-cyan hover:underline cursor-pointer flex items-center gap-1 font-medium"
            >
              <span>View Fullscreen</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateModal;
