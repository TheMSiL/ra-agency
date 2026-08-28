'use client';

import { useEffect, useRef } from 'react';

type Mote = {
  x: number;
  y: number;
  r: number;
  /** 0..1 — глубина: дальние мельче, темнее и медленнее */
  z: number;
  vy: number;
  sway: number;
  phase: number;
  twinkle: number;
};

type Props = {
  className?: string;
  /** 0..1 — пыль слегка разгорается вместе с прогрессом */
  intensity?: number;
  /** плотность: пылинок на миллион пикселей площади */
  density?: number;
};

export default function DustField({ className, intensity = 0, density = 62 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const glow = useRef(intensity);

  // держим свежую интенсивность без перезапуска цикла отрисовки
  useEffect(() => {
    glow.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(180, ((w * h) / 1_000_000) * density));
      motes = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: rand(0.35, 0.9) + z * 1.5,
          z,
          vy: -(rand(2, 7) + z * 9) / 60, // px за кадр при 60fps
          sway: rand(6, 22) * (0.4 + z),
          phase: Math.random() * Math.PI * 2,
          twinkle: rand(0.4, 1.6),
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const boost = 0.75 + glow.current * 0.55;
      const time = t / 1000;

      for (const m of motes) {
        if (!reduced) {
          m.y += m.vy;
          if (m.y < -8) {
            m.y = h + 8;
            m.x = Math.random() * w;
          }
        }

        const x = m.x + Math.sin(time * 0.28 + m.phase) * m.sway;
        const flicker = 0.62 + 0.38 * Math.sin(time * m.twinkle + m.phase);
        const alpha = (0.06 + m.z * 0.34) * flicker * boost;
        const r = m.r;

        // тёплое ядро + мягкое гало у ближних пылинок
        if (m.z > 0.55) {
          const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, r * 5);
          g.addColorStop(0, `rgba(255, 214, 130, ${alpha * 0.5})`);
          g.addColorStop(1, 'rgba(255, 190, 90, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, m.y, r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(255, 206, 112, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, m.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    build();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
