import { useEffect, useRef } from 'react';

interface BackgroundCanvasProps {
  isDark: boolean;
}

export function BackgroundCanvas({ isDark }: BackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle nodes definition
    const particleCount = Math.min(Math.floor((width * height) / 18000), 70);
    const maxDistance = 140;
    const mouse = { x: -1000, y: -1000, radius: 160 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      hue: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2 + 1.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius,
        baseRadius: radius,
        hue: Math.random() > 0.5 ? 217 : 260, // Electric blue or Violet
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background cyber grid
      ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.025)' : 'rgba(99, 102, 241, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Mouse proximity reaction
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          const force = (1 - distMouse / mouse.radius) * 0.8;
          p.x -= (dxMouse / distMouse) * force * 2;
          p.y -= (dyMouse / distMouse) * force * 2;
          p.radius = p.baseRadius + force * 2;
        } else {
          p.radius = p.baseRadius;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = p.hue === 217 ? 'rgba(96, 165, 250, 0.65)' : 'rgba(167, 139, 250, 0.65)';
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.hue === 217 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(139, 92, 246, 0.4)';
        } else {
          ctx.fillStyle = 'rgba(79, 70, 229, 0.45)';
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(99, 102, 241, 0.2)';
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // Connect particles with neural links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? `rgba(96, 165, 250, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect particle to mouse if close
        if (distMouse < mouse.radius) {
          const alpha = (1 - distMouse / mouse.radius) * (isDark ? 0.35 : 0.2);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isDark ? `rgba(34, 211, 238, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: isDark ? 0.85 : 0.65 }}
      aria-hidden="true"
    />
  );
}
