import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Activity,
  ShieldCheck,
  Camera,
  CameraOff,
  ExternalLink,
  Volume2,
  VolumeX,
  Maximize2,
  Code2,
  Copy,
  Check,
  Target,
  Smartphone,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AI_LAB_EXPERIMENTS } from '../data/portfolioData';
import {
  detectHandGesture,
  type HandDetectionResult,
} from '../utils/cvEngine';
import { defaultHandDetector, PYTHON_HAND_DETECTOR_SOURCE } from '../utils/handDetector';
import {
  defaultFaceMeshDetector,
  type FaceLandmarksResult,
  type FaceComplianceResult,
  PYTHON_EYE_TRACKING_SOURCE,
  PYTHON_FACE_COMPLIANCE_SOURCE,
} from '../utils/faceDetector';
import { audioSynth } from '../utils/audioSynth';

interface AILabProps {
  onOpenStudio?: (expId: string) => void;
}

export function AILab({ onOpenStudio }: AILabProps) {
  const [activeExpId, setActiveExpId] = useState<string>('gesture-volume');
  const [simVolume, setSimVolume] = useState<number>(75);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const [clickCount, setClickCount] = useState<number>(0);
  const [eyeClicks, setEyeClicks] = useState<number>(0);
  const [eyeTargetPos, setEyeTargetPos] = useState<{ x: number; y: number }>({ x: 240, y: 150 });
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [gazeResultText, setGazeResultText] = useState<string>('LOOKING CENTER');
  const [complianceStatusText, setComplianceStatusText] = useState<{ status: string; color: string }>({
    status: 'COMPLIANT',
    color: '#00FF00',
  });
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [codeType, setCodeType] = useState<'hands' | 'eyes' | 'compliance'>('hands');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const trackPadRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastWinkRef = useRef<boolean>(false);

  const getSourceCode = () => {
    if (codeType === 'eyes') return PYTHON_EYE_TRACKING_SOURCE;
    if (codeType === 'compliance') return PYTHON_FACE_COMPLIANCE_SOURCE;
    return PYTHON_HAND_DETECTOR_SOURCE;
  };

  const activeSourceCode = getSourceCode();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSourceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleAudio = () => {
    if (isAudioActive) {
      audioSynth.stopTone();
      setIsAudioActive(false);
    } else {
      audioSynth.startTone(440, simVolume);
      setIsAudioActive(true);
    }
  };

  const handleDistanceSlider = (distanceVal: number) => {
    const normalizedVol = Math.min(Math.max(Math.round(((distanceVal - 10) / 90) * 100), 0), 100);
    setSimVolume(normalizedVol);
    if (isAudioActive) {
      audioSynth.setVolume(normalizedVol);
    }
  };

  // Cross-device Mouse & Touch coordinate mapping
  const handleTrackPadMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackPadRef.current) return;
    const rect = trackPadRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(Math.round(((e.clientX - rect.left) / rect.width) * 100), 0), 100);
    const y = Math.min(Math.max(Math.round(((e.clientY - rect.top) / rect.height) * 100), 0), 100);
    setCursorPos({ x, y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!trackPadRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = trackPadRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(Math.round(((touch.clientX - rect.left) / rect.width) * 100), 0), 100);
    const y = Math.min(Math.max(Math.round(((touch.clientY - rect.top) / rect.height) * 100), 0), 100);
    setCursorPos({ x, y });
  };

  const handleTriggerPinch = () => {
    setIsPinching(true);
    setClickCount((c) => c + 1);
    audioSynth.playClickSound();
    setTimeout(() => setIsPinching(false), 200);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('muted', 'true');
        await videoRef.current.play().catch(() => {});
        setIsCameraActive(true);
      }
    } catch (err: any) {
      setCameraError(err.message || 'Webcam permission denied or not supported on this browser');
      setIsCameraActive(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      audioSynth.stopTone();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [stopCamera]);

  useEffect(() => {
    let pTime = performance.now();

    const processInlineFrame = async () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video && isCameraActive && video.readyState >= 2) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = 480;
          canvas.height = 360;

          // Mirrored camera feed (cv2.flip style)
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, -480, 0, 480, 360);
          ctx.restore();

          const cTime = performance.now();
          const fps = Math.round(1000 / Math.max(cTime - pTime, 1));
          pTime = cTime;

          if (activeExpId === 'gesture-volume') {
            await defaultHandDetector.findHands(ctx, video, 480, 360, true);
            const lmList = defaultHandDetector.findPosition(ctx, 480, 360, 0, true, '#FF00FF', false);

            let vol = simVolume;

            if (lmList.length >= 9) {
              const tx = lmList[4][1];
              const ty = lmList[4][2];
              const ix = lmList[8][1];
              const iy = lmList[8][2];

              const calculatedDist = Math.round(Math.hypot(ix - tx, iy - ty));
              vol = Math.min(Math.max(Math.round(((calculatedDist - 20) / 110) * 100), 0), 100);

              ctx.beginPath();
              ctx.moveTo(tx, ty);
              ctx.lineTo(ix, iy);
              ctx.strokeStyle = '#06B6D4';
              ctx.lineWidth = 2.5;
              ctx.stroke();

              ctx.fillStyle = '#06B6D4';
              ctx.font = 'bold 11px monospace';
              ctx.fillText(`Vol: ${vol}%`, (tx + ix) / 2 - 20, (ty + iy) / 2 - 8);
            } else {
              const hand: HandDetectionResult = detectHandGesture(ctx, 480, 360);
              vol = hand.volume;
            }

            setSimVolume(vol);
            if (isAudioActive) {
              audioSynth.setVolume(vol);
            }
          } else if (activeExpId === 'virtual-mouse') {
            await defaultHandDetector.findHands(ctx, video, 480, 360, true);
            const lmList = defaultHandDetector.findPosition(ctx, 480, 360, 0, false, '#FF00FF', false);

            let cursorX = 240;
            let cursorY = 180;
            let pinch = false;

            if (lmList.length >= 9) {
              cursorX = lmList[8][1];
              cursorY = lmList[8][2];
              const dist = Math.hypot(lmList[8][1] - lmList[4][1], lmList[8][2] - lmList[4][2]);
              pinch = dist < 35;
            } else {
              const hand: HandDetectionResult = detectHandGesture(ctx, 480, 360);
              cursorX = hand.index.x;
              cursorY = hand.index.y;
              pinch = hand.isPinch;
            }

            ctx.strokeStyle = pinch ? '#F43F5E' : '#06B6D4';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cursorX, cursorY, pinch ? 14 : 20, 0, Math.PI * 2);
            ctx.stroke();
            setIsPinching(pinch);
          } else if (activeExpId === 'eye-tracking') {
            await defaultFaceMeshDetector.processVideo(video);
            const faceResult: FaceLandmarksResult = defaultFaceMeshDetector.analyzeFace(ctx, 480, 360);

            // Target Point
            const tgtX = (eyeTargetPos.x / 640) * 480;
            const tgtY = (eyeTargetPos.y / 480) * 360;
            const tgtR = 34;

            // Moveable gaze cursor position
            const gX = (faceResult.gazeCursor.x / 640) * 480;
            const gY = (faceResult.gazeCursor.y / 480) * 360;

            const isHovering = Math.hypot(gX - tgtX, gY - tgtY) < tgtR + 10;

            // Draw Target Point
            ctx.fillStyle = isHovering ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.25)';
            ctx.beginPath();
            ctx.arc(tgtX, tgtY, tgtR, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = isHovering ? '#00FF00' : '#3B82F6';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`🎯 [Hits: ${eyeClicks}]`, tgtX - 35, tgtY - 2);

            // Draw Moveable Gaze Pointer
            ctx.strokeStyle = isHovering ? '#00FF00' : '#22D3EE';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(gX, gY, 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(34, 211, 238, 0.35)';
            ctx.fill();

            // Iris points
            ctx.fillStyle = '#00FF00';
            ctx.beginPath();
            ctx.arc(faceResult.leftIris.x, faceResult.leftIris.y, 4, 0, Math.PI * 2);
            ctx.arc(faceResult.rightIris.x, faceResult.rightIris.y, 4, 0, Math.PI * 2);
            ctx.fill();

            const isWink = faceResult.isLeftWink || faceResult.isLeftEyeClosed;
            if (isWink && !lastWinkRef.current) {
              if (isHovering) {
                audioSynth.playClickSound();
                setEyeClicks((c) => c + 1);
                try {
                  confetti({ particleCount: 25, spread: 50 });
                } catch {}
                const newX = Math.round(100 + Math.random() * 280);
                const newY = Math.round(80 + Math.random() * 200);
                setEyeTargetPos({ x: (newX / 480) * 640, y: (newY / 360) * 480 });
              }
            }
            lastWinkRef.current = isWink;

            ctx.fillStyle = '#00FF00';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(faceResult.gazeDirection, 15, 25);

            setGazeResultText(faceResult.gazeDirection);
          } else if (activeExpId === 'mask-detector') {
            await defaultFaceMeshDetector.processVideo(video);
            const compResult: FaceComplianceResult = defaultFaceMeshDetector.analyzeFaceCompliance(ctx, 480, 360);

            // Draw face center
            ctx.fillStyle = '#FF00FF';
            ctx.beginPath();
            ctx.arc(compResult.faceCenterX, compResult.faceCenterY, 6, 0, Math.PI * 2);
            ctx.fill();

            // Crosshair guide
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(240, 0);
            ctx.lineTo(240, 360);
            ctx.moveTo(0, 180);
            ctx.lineTo(480, 180);
            ctx.stroke();
            ctx.setLineDash([]);

            // Dark UI Box
            ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
            ctx.fillRect(10, 10, 290, 48);
            ctx.strokeStyle = compResult.statusColor;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(10, 10, 290, 48);

            ctx.fillStyle = compResult.statusColor;
            ctx.font = 'bold 15px sans-serif';
            ctx.fillText(`STATUS: ${compResult.status}`, 20, 32);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '10px sans-serif';
            ctx.fillText(`FPS: ${fps} | X-Off: ${compResult.horizontalOffset} | Y-Off: ${compResult.verticalOffset}`, 20, 48);

            setComplianceStatusText({ status: compResult.status, color: compResult.statusColor });
          }

          // FPS Overlay
          if (activeExpId === 'gesture-volume' || activeExpId === 'virtual-mouse') {
            ctx.fillStyle = '#FF00FF';
            ctx.font = 'bold 20px monospace';
            ctx.fillText(`FPS: ${fps}`, 15, 30);
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(processInlineFrame);
    };

    animFrameRef.current = requestAnimationFrame(processInlineFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, activeExpId, isAudioActive, simVolume, eyeClicks, eyeTargetPos]);

  const openInNewTab = (expId: string) => {
    const url = window.location.origin + window.location.pathname + '#ai-studio-' + expId;
    window.open(url, '_blank');
  };

  const activeExp = AI_LAB_EXPERIMENTS.find((e) => e.id === activeExpId) || AI_LAB_EXPERIMENTS[0];

  return (
    <section id="ai-lab" className="py-14 px-4 sm:px-6 lg:px-8 relative bg-dark-bg/40 light:bg-slate-100/40">
      <div className="max-w-6xl mx-auto">
        {/* Hidden video element configured for cross-device mobile autoplay */}
        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
          autoPlay
        />

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet-glow light:text-brand-violet font-mono text-xs uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>06 // REAL-TIME OPENCV & MEDIAPIPE LAB</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white light:text-slate-900 tracking-tight">
            AI & Computer Vision Lab
          </h2>
          <p className="mt-1.5 text-slate-400 light:text-slate-600 text-xs sm:text-sm max-w-lg leading-relaxed">
            Real-time hand landmark tracking, gesture volume modulation, virtual mouse, eye tracking with gaze cursor, and face compliance. Works on Mobile, Tablet & Laptop.
          </p>

          {/* Quick Launchers */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => openInNewTab(activeExpId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-brand-cyan bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/40 shadow-sm transition-all cursor-pointer"
            >
              <span>🚀 Open Live Studio in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (activeExpId === 'mask-detector') setCodeType('compliance');
                else if (activeExpId === 'eye-tracking') setCodeType('eyes');
                else setCodeType('hands');
                setShowCodeModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-dark-card hover:bg-dark-card-hover border border-white/10 transition-all cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Python OpenCV Source</span>
            </button>

            {onOpenStudio && (
              <button
                onClick={() => onOpenStudio(activeExpId)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-white bg-dark-card hover:bg-dark-card-hover border border-white/10 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3 h-3 text-brand-violet" />
                <span>Fullscreen Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* Experiment Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {AI_LAB_EXPERIMENTS.map((exp) => (
            <button
              key={exp.id}
              onClick={() => {
                setActiveExpId(exp.id);
                setCameraError(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                activeExpId === exp.id
                  ? 'card-cyber border-brand-cyan/50 bg-brand-cyan/10 light:bg-white text-brand-cyan shadow-md'
                  : 'bg-dark-surface/40 light:bg-white/60 border-white/5 light:border-slate-200 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-[10px] font-mono font-semibold truncate uppercase">
                {exp.id === 'mask-detector' ? 'Face Compliance' : exp.interactiveType.replace('_', ' ')}
              </div>
              <div className="font-display font-semibold text-xs sm:text-sm text-white light:text-slate-900 truncate mt-0.5">
                {exp.title.split(' ')[0]} {exp.title.split(' ')[1]}
              </div>
            </button>
          ))}
        </div>

        {/* Main Lab Card */}
        <div className="card-cyber p-5 sm:p-7 border-brand-violet/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Description & Launch Action */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet-glow border border-brand-violet/30">
                    {activeExp.tech}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" /> {activeExp.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white light:text-slate-900 mb-2">
                  {activeExp.title}
                </h3>

                <p className="text-slate-300 light:text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {activeExp.description}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-dark-bg/60 light:bg-slate-50 border border-white/5 light:border-slate-200 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Module Engine:</span>
                  <span className="text-brand-cyan font-bold">{activeExp.keyModule}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Input Stream:</span>
                  <span className="text-slate-200 light:text-slate-800">{activeExp.inputMethod}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Cross-Device Mode:</span>
                  <span className="text-emerald-400">Camera & Touch Simulator</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={() => openInNewTab(activeExp.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-brand-violet to-brand-cyan hover:opacity-95 shadow-md shadow-brand-violet/20 transition-all cursor-pointer"
                >
                  <span>Launch in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={isCameraActive ? stopCamera : startCamera}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                    isCameraActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-dark-bg/80 light:bg-white text-slate-300 light:text-slate-700 border border-white/10'
                  }`}
                >
                  {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                  <span>{isCameraActive ? 'Stop Inline Camera' : 'Start Webcam Feed'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Real-Time Interactive Simulator & Touch / Camera Feed */}
            <div className="lg:col-span-6 bg-dark-bg/90 light:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-brand-violet/20 font-mono text-xs text-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] text-slate-400 mb-3.5">
                <span className="text-brand-cyan flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  {isCameraActive ? 'LIVE CAMERA STREAM ACTIVE' : 'TOUCH & INTERACTIVE RUNTIME'}
                </span>
                <span className="hidden sm:inline">OpenCV & MediaPipe</span>
              </div>

              {/* Camera Error Banner if webcam blocked */}
              {cameraError && (
                <div className="mb-3.5 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Camera Note:</span>
                    <span>{cameraError}. You can still use the live Touch Simulator below!</span>
                  </div>
                </div>
              )}

              {/* Video Element if Camera active */}
              {isCameraActive ? (
                <div className="mb-4 rounded-xl overflow-hidden border border-brand-cyan/40 relative aspect-video bg-black flex items-center justify-center">
                  <canvas ref={canvasRef} className="w-full h-full object-cover" />
                </div>
              ) : (
                /* Turn On Camera Prompt Banner */
                <div className="mb-4 p-5 rounded-xl border border-dashed border-brand-cyan/40 bg-black/40 flex flex-col items-center justify-center text-center">
                  <Camera className="w-7 h-7 text-brand-cyan mb-1.5 animate-bounce" />
                  <div className="font-bold text-white text-xs sm:text-sm mb-1">Webcam & Front Camera Ready</div>
                  <p className="text-[11px] text-slate-400 mb-3 max-w-xs leading-snug">
                    Enable camera for live hands/eyes tracking, or use the touch controls below.
                  </p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-brand-blue to-brand-cyan hover:opacity-95 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Turn On Camera Now</span>
                  </button>
                </div>
              )}

              {/* Volume Gesture Simulator */}
              {activeExp.interactiveType === 'gesture_audio' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span>Thumb-Index Distance [ID:4 - ID:8]:</span>
                    <span className="text-brand-cyan font-bold">{Math.round((simVolume * 1.8) + 20)}px</span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simVolume}
                    onChange={(e) => handleDistanceSlider(Number(e.target.value))}
                    className="w-full accent-brand-cyan cursor-pointer h-8 touch-none"
                  />

                  <div className="p-3 rounded-lg bg-dark-surface light:bg-slate-800 border border-white/10 flex items-center justify-between">
                    <span>Modulated Volume:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-2.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan transition-all duration-150"
                          style={{ width: `${simVolume}%` }}
                        />
                      </div>
                      <span className="font-bold text-white w-8 text-right">{simVolume}%</span>
                    </div>
                  </div>

                  <button
                    onClick={toggleAudio}
                    className={`w-full py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isAudioActive
                        ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-brand-cyan" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{isAudioActive ? 'Sound Synthesizer: ON (Tone Active)' : 'Play Live Synth Audio'}</span>
                  </button>
                </div>
              )}

              {/* Virtual Mouse Simulator (With Touch Screen & Mobile Drag Support) */}
              {activeExp.interactiveType === 'virtual_mouse' && (
                <div className="space-y-3">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-brand-cyan" />
                      Drag or Touch trackpad:
                    </span>
                    <span>Clicks: <strong className="text-brand-cyan">{clickCount}</strong></span>
                  </div>

                  <div
                    ref={trackPadRef}
                    onMouseMove={handleTrackPadMove}
                    onTouchMove={handleTouchMove}
                    onTouchStart={handleTouchMove}
                    onClick={handleTriggerPinch}
                    className="relative w-full h-36 rounded-xl bg-black/50 border border-brand-cyan/30 cursor-crosshair flex items-center justify-center overflow-hidden touch-none select-none"
                  >
                    <div
                      className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 ${
                        isPinching ? 'bg-rose-400 scale-150 ring-4 ring-rose-400/30' : 'bg-brand-cyan ring-2 ring-brand-cyan/40'
                      }`}
                      style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                    />
                    <span className="text-[10px] text-slate-500 pointer-events-none text-center px-4">
                      Index Landmark [X: {cursorPos.x}%, Y: {cursorPos.y}%] • Tap or Click to Pinch
                    </span>
                  </div>
                </div>
              )}

              {/* Eye Tracking Simulator */}
              {activeExp.interactiveType === 'gaze_tracking' && (
                <div className="space-y-3 text-center py-1">
                  <div className="p-3 rounded-lg bg-dark-surface border border-white/10 flex items-center justify-around text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Gaze Direction</span>
                      <span className="text-[#00FF00] font-bold">{gazeResultText}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Single Target Hits</span>
                      <span className="text-brand-cyan font-bold">{eyeClicks}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEyeClicks((c) => c + 1);
                      audioSynth.playClickSound();
                      try {
                        confetti({ particleCount: 25, spread: 45 });
                      } catch {}
                    }}
                    className="w-full py-2.5 rounded-lg bg-brand-blue/20 hover:bg-brand-blue/30 border border-brand-blue/40 text-brand-cyan text-xs font-mono cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Click Target (Simulate Left Eye Wink)</span>
                  </button>
                </div>
              )}

              {/* Face Compliance Simulator */}
              {activeExp.interactiveType === 'mask_detector' && (
                <div className="space-y-3 py-1">
                  <div className="p-3 rounded-lg bg-dark-surface border border-white/10 flex items-center justify-between text-xs">
                    <span>Compliance Status:</span>
                    <span
                      style={{ color: complianceStatusText.color }}
                      className="px-2.5 py-0.5 rounded text-xs font-bold border border-white/10 bg-black/40"
                    >
                      STATUS: {complianceStatusText.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Calculates centering offset, horizontal/vertical alignment, and face sizing across any camera aspect ratio.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Python Source Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowCodeModal(false)}
          />
          <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-dark-surface border border-brand-cyan/40 shadow-2xl z-10 overflow-hidden">
            <div className="p-4 bg-dark-bg border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-white">
                <Code2 className="w-4 h-4 text-brand-cyan" />
                <span className="font-bold">
                  {codeType === 'compliance'
                    ? 'faceCompliance.py'
                    : codeType === 'eyes'
                      ? 'eyeTracking.py'
                      : 'handDetector.py'}
                </span>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => setCodeType('hands')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${codeType === 'hands' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    HandDetector
                  </button>
                  <button
                    onClick={() => setCodeType('eyes')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${codeType === 'eyes' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    EyeTracking
                  </button>
                  <button
                    onClick={() => setCodeType('compliance')}
                    className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${codeType === 'compliance' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    FaceCompliance
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-dark-card hover:bg-dark-card-hover text-slate-400 hover:text-white border border-white/10 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
            <pre className="p-4 overflow-auto text-xs font-mono text-slate-300 leading-relaxed bg-[#0a0d17]">
              <code>{activeSourceCode}</code>
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}

export default AILab;
