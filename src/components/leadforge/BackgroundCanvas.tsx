import { useEffect, useRef } from "react";

// Simple Three.js-free particle field using canvas — keeps deps light and 60fps
export function BackgroundCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    const particles: P[] = [];

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      particles.length = 0;
      const count = Math.floor((w * h) / 14000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: Math.random() * 1.4 + 0.4,
          c: Math.random() > 0.5 ? "0,212,255" : "124,58,237",
        });
      }
    };

    let angle = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // wireframe sphere (orthographic projection)
      const cx = w * 0.72, cy = h * 0.5;
      const R = Math.min(w, h) * 0.3;
      angle += 0.0015;
      ctx.strokeStyle = "rgba(0,212,255,0.08)";
      ctx.lineWidth = 1;
      const steps = 14;
      // latitude rings
      for (let i = 1; i < steps; i++) {
        const phi = (i / steps) * Math.PI - Math.PI / 2;
        const yOff = Math.sin(phi) * R;
        const rr = Math.cos(phi) * R;
        ctx.beginPath();
        ctx.ellipse(cx, cy + yOff, rr, rr * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // longitude lines (rotating)
      for (let i = 0; i < steps; i++) {
        const theta = (i / steps) * Math.PI + angle;
        const rx = Math.abs(Math.sin(theta)) * R;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // particles
      for (const p of particles) {
        // mouse repel
        if (mouse.current.active) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const f = (14000 - d2) / 14000 * 0.6;
            p.vx += (dx / Math.sqrt(d2 + 1)) * f * 0.25;
            p.vy += (dy / Math.sqrt(d2 + 1)) * f * 0.25;
          }
        }
        p.vx *= 0.96; p.vy *= 0.96;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.fillStyle = `rgba(${p.c}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // glow
        ctx.fillStyle = `rgba(${p.c}, 0.08)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };

    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
