import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}

export function RadialDial({ value, min = 3, max = 15, onChange }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const pct = (value - min) / (max - min);
  const startAngle = -135;
  const endAngle = 135;
  const angle = startAngle + pct * (endAngle - startAngle);

  // arc path
  const r = 58;
  const cx = 80, cy = 80;
  const polar = (a: number) => {
    const rad = (a - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const a0 = polar(startAngle);
  const a1 = polar(endAngle);
  const aV = polar(angle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const trackPath = `M ${a0.x} ${a0.y} A ${r} ${r} 0 ${largeArc} 1 ${a1.x} ${a1.y}`;
  const fillLargeArc = angle - startAngle > 180 ? 1 : 0;
  const fillPath = `M ${a0.x} ${a0.y} A ${r} ${r} 0 ${fillLargeArc} 1 ${aV.x} ${aV.y}`;

  // pointer interaction
  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: PointerEvent) => {
      const svg = ref.current; if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      let deg = Math.atan2(y, x) * (180 / Math.PI) + 90; // 0 = top
      if (deg > 180) deg -= 360;
      const clamped = Math.max(startAngle, Math.min(endAngle, deg));
      const newPct = (clamped - startAngle) / (endAngle - startAngle);
      const newVal = Math.round(min + newPct * (max - min));
      if (newVal !== value) onChange(newVal);
    };
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", stop);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stop);
    };
  }, [dragging, min, max, value, onChange]);

  return (
    <div className="flex items-center gap-5">
      <div className="relative">
        <svg
          ref={ref}
          width={160} height={160} viewBox="0 0 160 160"
          onPointerDown={() => setDragging(true)}
          className="cursor-grab active:cursor-grabbing select-none touch-none"
          style={{ filter: "drop-shadow(0 0 24px hsl(var(--accent-cyan) / 0.25))" }}
        >
          <defs>
            <linearGradient id="dialGrad" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
          <path d={trackPath} stroke="hsl(0 0% 100% / 0.06)" strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d={fillPath} stroke="url(#dialGrad)" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* knob handle */}
          <g transform={`translate(${aV.x} ${aV.y})`}>
            <circle r={9} fill="hsl(var(--bg-void))" stroke="hsl(var(--accent-cyan))" strokeWidth={2} />
            <circle r={3} fill="hsl(var(--accent-cyan))" />
          </g>
          {/* center number */}
          <text
            x={80} y={86} textAnchor="middle"
            className="font-mono"
            style={{ fontSize: 36, fontWeight: 700, fill: "hsl(var(--text-primary))" }}
          >
            {value}
          </text>
          <text x={80} y={108} textAnchor="middle" style={{ fontSize: 9, letterSpacing: 2, fill: "hsl(var(--text-secondary))", fontFamily: "JetBrains Mono" }}>
            LEADS
          </text>
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-brand/30 transition-colors text-sm font-mono"
        >+</button>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-brand/30 transition-colors text-sm font-mono"
        >−</button>
      </div>
    </div>
  );
}
