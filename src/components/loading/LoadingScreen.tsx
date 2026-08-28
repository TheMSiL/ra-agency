'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import DustField from './DustField';
import s from './LoadingScreen.module.css';

// three tree-shakes down to ~127 KB gzip. Split into its own chunk it downloads
// in parallel with hydration instead of sitting in front of it, and the splash
// loses nothing: its background, wordmark and counter are plain DOM, and the
// canvas fades in on its own animation anyway.
const RaLogo3D = dynamic(() => import('./RaLogo3D'), { ssr: false });

type Props = {
  /** 0–100. Если не передан — прогресс считается сам по готовности документа. */
  progress?: number;
  /** Минимальное время показа, мс. Чтобы экран не моргал на быстрой сети. */
  minDuration?: number;
  /** Подпись слева от процентов. */
  label?: string;
  /** Вызовется после того, как экран полностью исчез. */
  onDone?: () => void;
};

export default function LoadingScreen({
  progress,
  minDuration = 2200,
  label = 'Loading',
  onDone,
}: Props) {
  const controlled = typeof progress === 'number';

  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(0);
  const targetRef = useRef(0);

  // сглаженное значение живёт в ref и уходит прямо в шейдер и в CSS-переменную.
  // В state — только целые проценты, чтобы React не перерисовывался покадрово.
  const [smooth, setSmooth] = useState(0);
  const [percent, setPercent] = useState(0);
  const [state, setState] = useState<'in' | 'flash' | 'out' | 'gone'>('in');

  const paint = useCallback((v: number) => {
    rootRef.current?.style.setProperty('--p', (v / 100).toFixed(4));
    setSmooth(v / 100);
    const r = Math.round(v);
    setPercent((prev) => (prev === r ? prev : r));
  }, []);

  useEffect(() => {
    if (!controlled) return;
    targetRef.current = Math.min(100, Math.max(0, progress as number));
  }, [controlled, progress]);

  useEffect(() => {
    if (state !== 'in') return;

    let raf = 0;
    const start = performance.now();
    let last = start;
    let ready = document.readyState === 'complete';
    const onLoad = () => {
      ready = true;
    };
    window.addEventListener('load', onLoad);

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const elapsed = now - start;

      if (!controlled) {
        targetRef.current =
          ready && elapsed >= minDuration ? 100 : 92 * (1 - Math.exp(-elapsed / 900));
      }

      // сглаживание по времени, а не по кадрам: на 120 Гц скорость та же
      const k = 1 - Math.exp(-dt / 170);
      valueRef.current += (targetRef.current - valueRef.current) * k;
      if (valueRef.current > 99.5) valueRef.current = 100;

      paint(valueRef.current);

      if (valueRef.current >= 100) setState('flash');
      else raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', onLoad);
    };
  }, [state, controlled, minDuration, paint]);

  useEffect(() => {
    if (state !== 'flash') return;
    const t = setTimeout(() => setState('out'), 520);
    return () => clearTimeout(t);
  }, [state]);

  useEffect(() => {
    if (state !== 'out') return;
    const t = setTimeout(() => {
      setState('gone');
      onDone?.();
    }, 640);
    return () => clearTimeout(t);
  }, [state, onDone]);

  useEffect(() => {
    if (state === 'gone') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [state]);

  if (state === 'gone') return null;

  return (
    <div
      ref={rootRef}
      className={s.root}
      data-state={state}
      style={{ ['--p' as string]: '0' } as CSSProperties}
      role="progressbar"
      aria-label="Загрузка"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={s.haze} aria-hidden />
      <div className={s.vignette} aria-hidden />
      <DustField className={s.dust} intensity={percent / 100} />

      <div className={s.stage}>
        <div className={s.scene}>
          <div className={s.bloom} aria-hidden />
          <RaLogo3D className={s.canvas} progress={smooth} />
        </div>

        <div className={s.meta}>
          <span className={s.label}>{label}</span>
          <span className={s.percent}>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
