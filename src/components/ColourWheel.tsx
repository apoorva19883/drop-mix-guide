import { useRef, useEffect, useState, useCallback } from "react";
import { hslToHex } from "@/data/colours";

interface Props {
  size?: number;
  hue: number;
  saturation: number;
  onChange: (hue: number, saturation: number) => void;
}

export const ColourWheel = ({ size = 220, hue, saturation, onChange }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const handle = useCallback((e: { clientX: number; clientY: number }) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = r.width / 2;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const h = (angle + 360 + 90) % 360;
    const s = Math.min(100, (dist / radius) * 100);
    onChange(Math.round(h), Math.round(s));
  }, [onChange]);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => handle(e);
    const touch = (e: TouchEvent) => { if (e.touches[0]) handle({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }); };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", touch);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, handle]);

  // cursor position
  const angleRad = ((hue - 90) * Math.PI) / 180;
  const r = (saturation / 100) * (size / 2 - 8);
  const cx = size / 2 + Math.cos(angleRad) * r;
  const cy = size / 2 + Math.sin(angleRad) * r;
  const cursorHex = hslToHex(hue, saturation, 50);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => { setDragging(true); handle({ clientX: e.clientX, clientY: e.clientY }); }}
      onTouchStart={(e) => { setDragging(true); if (e.touches[0]) handle({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }); }}
      className="relative rounded-full cursor-crosshair touch-none select-none shadow-card"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(from 0deg, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }}
      />
      <div
        className="absolute h-12 w-12 rounded-full border-2 border-white shadow-card pointer-events-none"
        style={{ left: cx - 24, top: cy - 24, background: cursorHex, boxShadow: "0 0 0 2px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.2)" }}
      />
    </div>
  );
};
