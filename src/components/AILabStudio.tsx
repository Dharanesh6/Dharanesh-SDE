import { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CameraOff,
  Volume2,
  VolumeX,
  ArrowLeft,
  Scan,
  Radio,
  Eye,
  ShieldCheck,
  MousePointer,
  Zap,
  Code2,
  Copy,
  Check,
  Sparkles,
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

interface AILabStudioProps {
  initialExpId?: string;
  onExit: () => void;
}

export function AILabStudio({ initialExpId = 'gesture-volume', onExit }: AILabStudioProps) {
  const [activeExpId, setActiveExpId] = useState<string>(initialExpId);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(30);
  const [simVolume, setSimVolume] = useState<number>(75);
  const [detectedGesture, setDetectedGesture] = useState<string>('Ready');
  const [targetHits, setTargetHits] = useState<number>(0);
  const [eyeTargetHits, setEyeTargetHits] = useState<number>(0);
  const [eyeTargetPos, setEyeTargetPos] = useState<{ x: number; y: number }>({ x: 320, y: 180 });
  const [gazeDirection, setGazeDirection] = useState<string>('LOOKING CENTER');
  const [isLeftWinkActive, setIsLeftWinkActive] = useState<boolean>(false);
  const [complianceStatus, setComplianceStatus] = useState<{
    status: string;
    statusColor: string;
    faceWidth: number;
    horizontalOffset: number;
    verticalOffset: number;
  }>({
    status: 'COMPLIANT',
    statusColor: '#00FF00',
    faceWidth: 220,
    horizontalOffset: 0,
    verticalOffset: 0,
  });
  const [activeTab, setActiveTab] = useState<'stream' | 'code'>('stream');
  const [codeLang, setCodeLang] = useState<'hands' | 'eyes' | 'compliance'>('hands');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastPinchRef = useRef<boolean>(false);
  const lastWinkRef = useRef<boolean>(false);

  const getSourceCode = () => {
    if (codeLang === 'eyes') return PYTHON_EYE_TRACKING_SOURCE;
    if (codeLang === 'compliance') return PYTHON_FACE_COMPLIANCE_SOURCE;
    return PYTHON_HAND_DETECTOR_SOURCE;
  };

  const currentSourceCode = getSourceCode();

  const handleCopyPython = () => {
    navigator.clipboard.writeText(currentSourceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Audio Toggle (Only for Gesture Audio)
  const toggleAudio = () => {
    if (isAudioActive) {
      audioSynth.stopTone();
      setIsAudioActive(false);
    } else {
      audioSynth.startTone(440, simVolume);
      setIsAudioActive(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setSimVolume(newVol);
    if (isAudioActive) {
      audioSynth.setVolume(newVol);
    }
  };

  // Webcam Start/Stop
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      setCameraError(err.message || 'Camera permission denied or unavailable');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      audioSynth.stopTone();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Main Real-Time Computer Vision Processing Loop
  useEffect(() => {
    let pTime = performance.now();
    let currentFps = 30;

    const processFrame = async () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (canvas && video && isCameraActive && video.readyState >= 2) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = 640;
          canvas.height = 480;

          // 1. Draw Mirrored Raw Camera Feed (cv2.flip(frame, 1) style)
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(video, -640, 0, 640, 480);
          ctx.restore();

          // Calculate Real FPS: fps = 1 / (cTime - pTime)
          const cTime = performance.now();
          const delta = (cTime - pTime) / 1000;
          if (delta > 0) {
            currentFps = Math.round(1 / delta);
          }
          pTime = cTime;
          setFps(currentFps);

          // 2. FEATURE-SPECIFIC REAL-TIME COMPUTER VISION
          if (activeExpId === 'gesture-volume') {
            await defaultHandDetector.findHands(ctx, video, 640, 480, true);
            const lmList = defaultHandDetector.findPosition(ctx, 640, 480, 0, true, '#FF00FF', true);

            let thumbX = 260;
            let thumbY = 240;
            let indexX = 380;
            let indexY = 240;
            let calculatedDist = 120;
            let vol = simVolume;
            let isPinch = false;

            if (lmList.length >= 9) {
              thumbX = lmList[4][1];
              thumbY = lmList[4][2];
              indexX = lmList[8][1];
              indexY = lmList[8][2];

              calculatedDist = Math.round(Math.hypot(indexX - thumbX, indexY - thumbY));
              vol = Math.min(Math.max(Math.round(((calculatedDist - 25) / 140) * 100), 0), 100);
              isPinch = calculatedDist < 45;
            } else {
              const hand: HandDetectionResult = detectHandGesture(ctx, 640, 480);
              thumbX = hand.thumb.x;
              thumbY = hand.thumb.y;
              indexX = hand.index.x;
              indexY = hand.index.y;
              calculatedDist = hand.distance;
              vol = hand.volume;
              isPinch = hand.isPinch;
            }

            // Line between Thumb and Index
            ctx.beginPath();
            ctx.moveTo(thumbX, thumbY);
            ctx.lineTo(indexX, indexY);
            ctx.strokeStyle = '#06B6D4';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Highlights
            ctx.fillStyle = '#FF00FF'; // (255, 0, 255)
            ctx.beginPath();
            ctx.arc(thumbX, thumbY, 8, 0, Math.PI * 2);
            ctx.arc(indexX, indexY, 8, 0, Math.PI * 2);
            ctx.fill();

            const midX = (thumbX + indexX) / 2;
            const midY = (thumbY + indexY) / 2;
            ctx.fillStyle = '#06B6D4';
            ctx.font = 'bold 14px monospace';
            ctx.fillText(`Dist: ${calculatedDist}px | Vol: ${vol}%`, midX - 70, midY - 14);

            setSimVolume(vol);
            setDetectedGesture(isPinch ? 'PINCH [ID:4-8 < 45px]' : `TRACKING [Vol: ${vol}%]`);

            if (isAudioActive) {
              audioSynth.setVolume(vol);
            }

            ctx.fillStyle = '#FF00FF';
            ctx.font = 'bold 32px monospace';
            ctx.fillText(`FPS: ${currentFps}`, 25, 60);
          } else if (activeExpId === 'virtual-mouse') {
            await defaultHandDetector.findHands(ctx, video, 640, 480, true);
            const lmList = defaultHandDetector.findPosition(ctx, 640, 480, 0, false, '#FF00FF', false);

            let cursorX = 320;
            let cursorY = 240;
            let isPinch = false;

            if (lmList.length >= 9) {
              cursorX = lmList[8][1];
              cursorY = lmList[8][2];
              const dist = Math.hypot(lmList[8][1] - lmList[4][1], lmList[8][2] - lmList[4][2]);
              isPinch = dist < 42;
            } else {
              const hand: HandDetectionResult = detectHandGesture(ctx, 640, 480);
              cursorX = hand.index.x;
              cursorY = hand.index.y;
              isPinch = hand.isPinch;
            }

            // Reticle
            ctx.strokeStyle = isPinch ? '#F43F5E' : '#06B6D4';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cursorX, cursorY, isPinch ? 18 : 28, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(cursorX - 35, cursorY);
            ctx.lineTo(cursorX + 35, cursorY);
            ctx.moveTo(cursorX, cursorY - 35);
            ctx.lineTo(cursorX, cursorY + 35);
            ctx.strokeStyle = isPinch ? '#FB7185' : '#22D3EE';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = isPinch ? 'rgba(244, 63, 94, 0.35)' : 'rgba(6, 182, 212, 0.2)';
            ctx.fill();

            // Target
            const targetX = 320;
            const targetY = 160;
            const targetRadius = 45;

            ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
            ctx.beginPath();
            ctx.arc(targetX, targetY, targetRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(`TARGET ARENA [Hits: ${targetHits}]`, targetX - 60, targetY - 5);

            const distToTarget = Math.hypot(cursorX - targetX, cursorY - targetY);
            const isHitting = distToTarget < targetRadius;

            if (isPinch && !lastPinchRef.current) {
              audioSynth.playClickSound();
              if (isHitting) {
                setTargetHits((h) => h + 1);
                try {
                  confetti({ particleCount: 30, spread: 60 });
                } catch {}
              }
            }
            lastPinchRef.current = isPinch;

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px monospace';
            ctx.fillText(
              `Index Pos [ID:8]: (${cursorX}, ${cursorY}) ${isPinch ? '• [PINCH CLICK!]' : ''}`,
              cursorX + 25,
              cursorY + 5
            );

            setDetectedGesture(isPinch ? 'PINCH CLICK (pyautogui)' : 'HOVER (MediaPipe Index)');

            ctx.fillStyle = '#FF00FF';
            ctx.font = 'bold 32px monospace';
            ctx.fillText(`FPS: ${currentFps}`, 25, 60);
          } else if (activeExpId === 'eye-tracking') {
            // -------------------------------------------------------------
            // REAL-TIME EYE GAZE CURSOR & SINGLE DYNAMIC TARGET POINT
            // -------------------------------------------------------------
            await defaultFaceMeshDetector.processVideo(video);
            const faceResult: FaceLandmarksResult = defaultFaceMeshDetector.analyzeFace(ctx, 640, 480);

            // 1. Draw Eye Contours
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
            ctx.lineWidth = 1.5;

            if (faceResult.eyeContours.left.length > 0) {
              ctx.beginPath();
              ctx.moveTo(faceResult.eyeContours.left[0].x, faceResult.eyeContours.left[0].y);
              for (const pt of faceResult.eyeContours.left) ctx.lineTo(pt.x, pt.y);
              ctx.closePath();
              ctx.stroke();
            }

            if (faceResult.eyeContours.right.length > 0) {
              ctx.beginPath();
              ctx.moveTo(faceResult.eyeContours.right[0].x, faceResult.eyeContours.right[0].y);
              for (const pt of faceResult.eyeContours.right) ctx.lineTo(pt.x, pt.y);
              ctx.closePath();
              ctx.stroke();
            }

            // Green Iris points (0, 255, 0)
            ctx.fillStyle = '#00FF00';
            ctx.beginPath();
            ctx.arc(faceResult.leftIris.x, faceResult.leftIris.y, 6, 0, Math.PI * 2);
            ctx.arc(faceResult.rightIris.x, faceResult.rightIris.y, 6, 0, Math.PI * 2);
            ctx.fill();

            // 2. THE SINGLE INTERACTIVE TARGET POINT
            const tgtX = eyeTargetPos.x;
            const tgtY = eyeTargetPos.y;
            const tgtRadius = 45;

            // Moveable Gaze Cursor Position (like mouse cursor controlled by eye)
            const gX = faceResult.gazeCursor.x;
            const gY = faceResult.gazeCursor.y;

            // Check if Gaze Cursor is on the Target Point
            const distToTarget = Math.hypot(gX - tgtX, gY - tgtY);
            const isHoveringTarget = distToTarget < tgtRadius + 15;

            // Draw Single Target Point
            ctx.fillStyle = isHoveringTarget ? 'rgba(16, 185, 129, 0.35)' : 'rgba(59, 130, 246, 0.2)';
            ctx.beginPath();
            ctx.arc(tgtX, tgtY, tgtRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = isHoveringTarget ? '#00FF00' : '#3B82F6';
            ctx.lineWidth = isHoveringTarget ? 3.5 : 2;
            ctx.stroke();

            // Pulsing Target Lock Ring
            if (isHoveringTarget) {
              ctx.strokeStyle = '#22D3EE';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(tgtX, tgtY, tgtRadius + 8, 0, Math.PI * 2);
              ctx.stroke();
            }

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(`🎯 TARGET [Hits: ${eyeTargetHits}]`, tgtX - 55, tgtY - 6);
            ctx.fillStyle = isHoveringTarget ? '#00FF00' : '#94A3B8';
            ctx.font = '10px monospace';
            ctx.fillText(isHoveringTarget ? '👁️ LOCKED: WINK TO CLICK' : 'AIM EYE HERE', tgtX - 58, tgtY + 12);

            // 3. DRAW MOVEABLE GAZE POINTER (VIRTUAL EYE MOUSE)
            ctx.strokeStyle = isHoveringTarget ? '#00FF00' : '#22D3EE';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(gX, gY, 16, 0, Math.PI * 2);
            ctx.stroke();

            // Gaze Crosshairs
            ctx.beginPath();
            ctx.moveTo(gX - 24, gY);
            ctx.lineTo(gX + 24, gY);
            ctx.moveTo(gX, gY - 24);
            ctx.lineTo(gX, gY + 24);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = isHoveringTarget ? 'rgba(0, 255, 0, 0.4)' : 'rgba(34, 211, 238, 0.3)';
            ctx.fill();

            ctx.fillStyle = '#22D3EE';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(`Gaze Pos: (${gX}, ${gY})`, gX + 18, gY - 18);

            // 4. DETECT LEFT EYE WINK CLICK ON TARGET
            const isLeftWink = faceResult.isLeftWink || faceResult.isLeftEyeClosed;
            setIsLeftWinkActive(isLeftWink);

            if (isLeftWink && !lastWinkRef.current) {
              if (isHoveringTarget) {
                audioSynth.playClickSound();
                setEyeTargetHits((h) => h + 1);
                try {
                  confetti({
                    particleCount: 50,
                    spread: 80,
                    origin: { x: tgtX / 640, y: tgtY / 480 },
                  });
                } catch {}

                // Move target to a new random location on hit!
                const newX = Math.round(120 + Math.random() * 400);
                const newY = Math.round(100 + Math.random() * 260);
                setEyeTargetPos({ x: newX, y: newY });
              }
            }
            lastWinkRef.current = isLeftWink;

            if (isLeftWink) {
              ctx.fillStyle = '#00FF00';
              ctx.fillRect(160, 220, 320, 36);
              ctx.fillStyle = '#000000';
              ctx.font = 'bold 14px monospace';
              ctx.fillText('😉 LEFT EYE WINK: CLICK TRIGGERED!', 175, 243);
            }

            // Direction text (30, 55)
            ctx.fillStyle = '#00FF00';
            ctx.font = 'bold 28px sans-serif';
            ctx.fillText(faceResult.gazeDirection, 30, 55);

            // FPS (30, 90)
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(`FPS: ${currentFps} | Hits: ${eyeTargetHits}`, 30, 90);

            setGazeDirection(`${faceResult.gazeDirection} (Pos: ${gX}, ${gY})`);
          } else if (activeExpId === 'mask-detector') {
            // -------------------------------------------------------------
            // EXACT FACE COMPLIANCE DETECTION (WITH UP/DOWN TRACKING)
            // -------------------------------------------------------------
            await defaultFaceMeshDetector.processVideo(video);
            const compResult: FaceComplianceResult = defaultFaceMeshDetector.analyzeFaceCompliance(ctx, 640, 480);

            // Draw Landmark Points (Nose, Cheeks, Eyes)
            ctx.fillStyle = '#22D3EE';
            [compResult.nose, compResult.leftCheek, compResult.rightCheek, compResult.leftEye, compResult.rightEye].forEach((pt) => {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
              ctx.fill();
            });

            // Draw Face Center in Magenta
            ctx.fillStyle = '#FF00FF'; // (255, 0, 255)
            ctx.beginPath();
            ctx.arc(compResult.faceCenterX, compResult.faceCenterY, 8, 0, Math.PI * 2);
            ctx.fill();

            // Connecting Width Line
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(compResult.leftCheek.x, compResult.leftCheek.y);
            ctx.lineTo(compResult.rightCheek.x, compResult.rightCheek.y);
            ctx.stroke();

            // Camera Center Crosshair Guide (X=320, Y=240)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(320, 0);
            ctx.lineTo(320, 480);
            ctx.moveTo(0, 240);
            ctx.lineTo(640, 240);
            ctx.stroke();
            ctx.setLineDash([]);

            // Exact Python UI Box: cv2.rectangle(frame, (15, 15), (450, 85), (20, 20, 20), -1)
            ctx.fillStyle = 'rgba(20, 20, 20, 0.9)';
            ctx.fillRect(15, 15, 435, 70);
            ctx.strokeStyle = compResult.statusColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(15, 15, 435, 70);

            // Status text
            ctx.fillStyle = compResult.statusColor;
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(`STATUS: ${compResult.status}`, 30, 55);

            // FPS text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 18px sans-serif';
            ctx.fillText(`FPS: ${currentFps}`, 30, 115);

            // Diagnostic offset telemetry
            ctx.fillStyle = '#94A3B8';
            ctx.font = '11px monospace';
            ctx.fillText(
              `Width: ${compResult.faceWidth}px | X-Off: ${compResult.horizontalOffset}px | Y-Off: ${compResult.verticalOffset}px`,
              30,
              450
            );

            setComplianceStatus({
              status: compResult.status,
              statusColor: compResult.statusColor,
              faceWidth: compResult.faceWidth,
              horizontalOffset: compResult.horizontalOffset,
              verticalOffset: compResult.verticalOffset,
            });
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive, activeExpId, isAudioActive, targetHits, eyeTargetHits, eyeTargetPos, simVolume]);

  const activeExp = AI_LAB_EXPERIMENTS.find((e) => e.id === activeExpId) || AI_LAB_EXPERIMENTS[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#070A12] text-slate-100 flex flex-col overflow-hidden font-sans">
      {/* Hidden Video Feed for Stream Processing */}
      <video ref={videoRef} className="hidden" playsInline muted />

      {/* Top Studio Navbar */}
      <header className="h-14 px-4 sm:px-6 border-b border-white/10 bg-dark-surface/90 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Studio</span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            <span className="font-display font-bold text-sm tracking-tight text-white">
              OpenCV & MediaPipe Live Studio
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs font-mono text-brand-cyan">Real-Time Computer Vision</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'stream' ? 'bg-brand-blue text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Video Stream
            </button>
            <button
              onClick={() => {
                setActiveTab('code');
                if (activeExpId === 'mask-detector') setCodeLang('compliance');
                else if (activeExpId === 'eye-tracking') setCodeLang('eyes');
                else setCodeLang('hands');
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'code' ? 'bg-brand-blue text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Python Source</span>
            </button>
          </div>

          {/* Audio Synthesizer Toggle (Only when Gesture Volume is active) */}
          {activeExpId === 'gesture-volume' && (
            <button
              onClick={toggleAudio}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                isAudioActive
                  ? 'bg-brand-blue/20 text-brand-cyan border border-brand-blue/40'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              {isAudioActive ? <Volume2 className="w-3.5 h-3.5 text-brand-cyan" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAudioActive ? 'Sound ON' : 'Sound OFF'}</span>
            </button>
          )}

          {/* Camera Stream Toggle */}
          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              isCameraActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
            <span>{isCameraActive ? 'Stop Webcam' : 'Start Webcam'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Feature Module Selector */}
        <aside className="w-full lg:w-72 p-4 border-b lg:border-b-0 lg:border-r border-white/10 bg-dark-bg/60 overflow-y-auto shrink-0">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-3">
            OpenCV & MediaPipe Modules
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {[
              { id: 'gesture-volume', name: 'Gesture Audio', icon: Radio, sub: 'ID:4 & ID:8 Landmark Distance' },
              { id: 'virtual-mouse', name: 'Virtual Mouse', icon: MousePointer, sub: 'Hand Tracking & Pinch Click' },
              { id: 'eye-tracking', name: 'Eye Gaze & Wink Click', icon: Eye, sub: 'Gaze Cursor + Left Eye Click' },
              { id: 'mask-detector', name: 'Face Compliance', icon: Scan, sub: 'Centering, Size & Up/Down' },
            ].map((mod) => {
              const Icon = mod.icon;
              const isSelected = activeExpId === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveExpId(mod.id);
                    if (mod.id === 'mask-detector') setCodeLang('compliance');
                    else if (mod.id === 'eye-tracking') setCodeLang('eyes');
                    else setCodeLang('hands');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-blue/15 border-brand-blue/50 text-white shadow-md'
                      : 'bg-dark-surface/40 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-cyan' : 'text-slate-500'}`} />
                    <span className="font-display font-bold text-xs sm:text-sm">{mod.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">{mod.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Module-Specific Guidance */}
          {activeExpId === 'eye-tracking' && (
            <div className="mt-4 p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-mono space-y-1.5">
              <div className="text-brand-cyan font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> EYE CONTROL INSTRUCTIONS:
              </div>
              <p className="text-[11px] text-slate-300">
                1. <strong>Move your eyes</strong> to guide the cyan Gaze Cursor onto the Target Point.
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold">
                2. <strong>Close / Wink your Left Eye</strong> to trigger a Click!
              </p>
            </div>
          )}

          {activeExpId === 'mask-detector' && (
            <div className="mt-4 p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-mono space-y-1.5">
              <div className="text-brand-cyan font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> COMPLIANCE RULES:
              </div>
              <p className="text-[11px] text-slate-300">
                • <strong>Size:</strong> Width &gt; 15% (Move Closer)
              </p>
              <p className="text-[11px] text-slate-300">
                • <strong>Horizontal:</strong> Offset &lt; 15% (Move Left/Right)
              </p>
              <p className="text-[11px] text-slate-300">
                • <strong>Vertical:</strong> Offset &lt; 16% (Move Up/Down)
              </p>
              <p className="text-[11px] text-slate-300">
                • <strong>Orientation:</strong> Face Camera Directly
              </p>
            </div>
          )}

          {/* Diagnostic Stats */}
          <div className="mt-4 p-3 rounded-xl bg-dark-card/60 border border-white/5 text-[11px] font-mono space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Pipeline Engine:</span>
              <span className={isCameraActive ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {isCameraActive ? 'LIVE ACTIVE' : 'CAMERA OFF'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Frame Rate:</span>
              <span className="text-[#00FF00] font-bold">{isCameraActive ? `${fps} FPS` : '60 FPS'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Resolution:</span>
              <span>640 × 480 (RGB)</span>
            </div>
          </div>
        </aside>

        {/* Center: Real-Time Processed Canvas Viewport OR Python Code Viewer */}
        <main className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden bg-black/50">
          {activeTab === 'code' ? (
            /* Python Source Viewer */
            <div className="w-full max-w-3xl h-full max-h-[80vh] flex flex-col rounded-2xl bg-dark-surface border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-3 bg-dark-bg border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Code2 className="w-4 h-4 text-brand-cyan" />
                  <span className="font-bold">
                    {codeLang === 'compliance'
                      ? 'faceCompliance.py'
                      : codeLang === 'eyes'
                        ? 'eyeTracking.py'
                        : 'handDetector.py'}
                  </span>
                  <div className="flex gap-1 ml-3">
                    <button
                      onClick={() => setCodeLang('hands')}
                      className={`px-2 py-0.5 rounded text-[10px] ${codeLang === 'hands' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      HandDetector
                    </button>
                    <button
                      onClick={() => setCodeLang('eyes')}
                      className={`px-2 py-0.5 rounded text-[10px] ${codeLang === 'eyes' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      EyeTracking
                    </button>
                    <button
                      onClick={() => setCodeLang('compliance')}
                      className={`px-2 py-0.5 rounded text-[10px] ${codeLang === 'compliance' ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      FaceCompliance
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleCopyPython}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 overflow-auto text-xs font-mono text-slate-300 leading-relaxed bg-[#0a0d17]">
                <code>{currentSourceCode}</code>
              </pre>
            </div>
          ) : (
            /* Real-Time Live Camera / Big Start Camera Button in Center */
            <>
              {cameraError && (
                <div className="mb-4 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
                  ⚠ Camera Note: {cameraError}. Please grant webcam permissions.
                </div>
              )}

              <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl bg-dark-card/80 border border-brand-cyan/30 overflow-hidden shadow-2xl flex items-center justify-center">
                {isCameraActive ? (
                  <canvas ref={canvasRef} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full p-8 flex flex-col justify-center items-center text-center bg-gradient-to-br from-dark-surface via-[#0d1222] to-dark-bg">
                    <div className="w-20 h-20 rounded-full bg-brand-cyan/10 border-2 border-brand-cyan/40 flex items-center justify-center mb-5 animate-pulse shadow-lg shadow-brand-cyan/20">
                      <Camera className="w-10 h-10 text-brand-cyan" />
                    </div>

                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2">
                      Start Camera for {activeExp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                      {activeExpId === 'eye-tracking' &&
                        'Tracks your eye pupil movements to position the Gaze Cursor on target, and detects Left-Eye winks to click!'}
                      {activeExpId === 'mask-detector' &&
                        'Real-time Face Compliance analysis verifying horizontal centering, vertical up/down alignment, and size.'}
                      {activeExpId === 'gesture-volume' &&
                        'Measures Thumb-Index fingertip distance (ID:4 to ID:8) to modulate system audio levels in real time.'}
                      {activeExpId === 'virtual-mouse' &&
                        'Translates index finger coordinates to screen cursor movements and detects pinch gestures to trigger clicks.'}
                    </p>

                    {/* BIG CENTER CAMERA START BUTTON */}
                    <button
                      onClick={startCamera}
                      className="px-8 py-3.5 rounded-2xl text-sm font-mono font-bold text-white bg-gradient-to-r from-brand-blue via-brand-cyan to-emerald-400 hover:opacity-95 shadow-xl shadow-brand-blue/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Turn On Camera</span>
                    </button>

                    <span className="text-[11px] font-mono text-slate-500 mt-4">
                      Client-side MediaPipe inference • Zero cloud latency • 60 FPS
                    </span>
                  </div>
                )}

                {/* Glowing Corner Accents */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-brand-cyan pointer-events-none" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-brand-cyan pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-brand-cyan pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-brand-cyan pointer-events-none" />
              </div>
            </>
          )}
        </main>

        {/* Right Sidebar: Telemetry Stream (Cleaned without irrelevant volume controls) */}
        <aside className="w-full lg:w-80 p-4 border-t lg:border-t-0 lg:border-l border-white/10 bg-dark-bg/60 overflow-y-auto shrink-0">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-3">
            Live OpenCV Telemetry
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-dark-card/70 border border-white/10 text-xs font-mono space-y-1.5">
              <div className="text-brand-blue-glow font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-cyan" /> {activeExp.title}
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed">
                {activeExp.description}
              </div>
            </div>

            {/* FEATURE-SPECIFIC TELEMETRY */}
            {activeExpId === 'gesture-volume' && (
              <div className="p-3.5 rounded-xl bg-dark-card/70 border border-white/10 text-xs font-mono space-y-2.5">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Audio Telemetry</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Gesture State:</span>
                  <span className="text-emerald-400 font-bold">{detectedGesture}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Volume Level:</span>
                  <span className="text-brand-cyan font-bold">{simVolume}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full transition-all"
                    style={{ width: `${simVolume}%` }}
                  />
                </div>
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => handleVolumeChange(Math.min(simVolume + 15, 100))}
                    className="w-full py-1.5 rounded-lg text-xs font-mono bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-cyan border border-brand-blue/40 transition-colors cursor-pointer"
                  >
                    + Increase Volume (Spread)
                  </button>
                  <button
                    onClick={() => handleVolumeChange(Math.max(simVolume - 15, 0))}
                    className="w-full py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
                  >
                    - Decrease Volume (Pinch)
                  </button>
                </div>
              </div>
            )}

            {activeExpId === 'virtual-mouse' && (
              <div className="p-3.5 rounded-xl bg-dark-card/70 border border-white/10 text-xs font-mono space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Virtual Mouse Telemetry</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Mouse State:</span>
                  <span className="text-emerald-400 font-bold">{detectedGesture}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Target Hits:</span>
                  <span className="text-brand-cyan font-bold">{targetHits}</span>
                </div>
              </div>
            )}

            {activeExpId === 'eye-tracking' && (
              <div className="p-3.5 rounded-xl bg-dark-card/70 border border-white/10 text-xs font-mono space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Eye Gaze & Wink Telemetry</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Gaze Direction:</span>
                  <span className="text-[#00FF00] font-bold">{gazeDirection}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Left Eye State:</span>
                  <span className={isLeftWinkActive ? 'text-emerald-400 font-bold animate-pulse' : 'text-slate-400'}>
                    {isLeftWinkActive ? '😉 CLOSED (WINK CLICK!)' : 'OPEN'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Target Hits Total:</span>
                  <span className="text-brand-cyan font-bold text-sm">{eyeTargetHits}</span>
                </div>
                <button
                  onClick={() => {
                    const newX = Math.round(120 + Math.random() * 400);
                    const newY = Math.round(100 + Math.random() * 260);
                    setEyeTargetPos({ x: newX, y: newY });
                  }}
                  className="w-full mt-2 py-2 rounded-lg text-xs font-mono bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-cyan border border-brand-blue/40 transition-colors cursor-pointer"
                >
                  🎲 Respawn Target Location
                </button>
              </div>
            )}

            {activeExpId === 'mask-detector' && (
              <div className="p-3.5 rounded-xl bg-dark-card/70 border border-white/10 text-xs font-mono space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Compliance Telemetry</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Status:</span>
                  <span style={{ color: complianceStatus.statusColor }} className="font-bold">
                    {complianceStatus.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Face Width:</span>
                  <span className="text-brand-cyan font-bold">{complianceStatus.faceWidth}px</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>X Centering Offset:</span>
                  <span className={Math.abs(complianceStatus.horizontalOffset) < 96 ? 'text-emerald-400' : 'text-amber-400'}>
                    {complianceStatus.horizontalOffset}px
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Y Up/Down Offset:</span>
                  <span className={Math.abs(complianceStatus.verticalOffset) < 76 ? 'text-emerald-400' : 'text-amber-400'}>
                    {complianceStatus.verticalOffset}px
                  </span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
