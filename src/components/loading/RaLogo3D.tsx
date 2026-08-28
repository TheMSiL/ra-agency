'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { raTriangles } from './ra-mesh';

type Props = {
  className?: string;
  /** 0..1 — насколько знак собран */
  progress?: number;
};

const VERT = /* glsl */ `
  attribute vec3 aCentroid;
  attribute vec3 aScatter;
  attribute vec3 aAxis;
  attribute float aDelay;

  uniform float uProgress;

  varying vec3 vNormal;
  varying vec3 vView;
  varying float vT;

  mat3 axisRot(vec3 axis, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    float t = 1.0 - c;
    vec3 a = normalize(axis);
    return mat3(
      t * a.x * a.x + c,        t * a.x * a.y - s * a.z,  t * a.x * a.z + s * a.y,
      t * a.x * a.y + s * a.z,  t * a.y * a.y + c,        t * a.y * a.z - s * a.x,
      t * a.x * a.z - s * a.y,  t * a.y * a.z + s * a.x,  t * a.z * a.z + c
    );
  }

  void main() {
    // каждый осколок стартует в своё время
    float t = clamp((uProgress - aDelay) / 0.5, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0); // easeOutCubic
    vT = t;

    mat3 r = axisRot(aAxis, (1.0 - t) * 3.4);
    vec3 local = r * ((position - aCentroid) * mix(0.55, 1.0, t));
    vec3 pos = aCentroid + local + aScatter * (1.0 - t);

    vNormal = normalize(normalMatrix * (r * normal));
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uDark;
  uniform vec3 uMid;
  uniform vec3 uHot;

  varying vec3 vNormal;
  varying vec3 vView;
  varying float vT;

  void main() {
    // боковины экструзии смотрят «наружу» в разные стороны —
    // разворачиваем нормаль к камере, чтобы свет не зависел от намотки
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(vView);

    // ключевой свет сверху-слева, заполняющий снизу-справа
    float key = max(dot(n, normalize(vec3(-0.45, 0.75, 0.55))), 0.0);
    float fill = max(dot(n, normalize(vec3(0.6, -0.4, 0.35))), 0.0) * 0.35;

    // контровой ободок по краю силуэта
    float rim = pow(1.0 - max(dot(n, v), 0.0), 2.6);

    vec3 col = mix(uDark, uMid, key);
    col = mix(col, uHot, key * key * 0.55 + rim * 0.7);
    col += uMid * fill;

    // пока осколок летит — он холоднее и прозрачнее
    col *= mix(0.45, 1.0, vT);
    float alpha = smoothstep(0.0, 0.3, vT);

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function RaLogo3D({ className, progress = 0 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // камера отодвинута: при z = 4.2 полукадр был 1.28 при полуширине знака 1.0,
    // то есть запас на разлёт всего 0.28 — осколки срезало краем канваса
    // ровным прямоугольником. При 6.2 запас 0.9.
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    /* --- геометрия: каждый треугольник получает свою «судьбу» --- */
    const tri = raTriangles();
    const count = tri.length / 9;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(tri, 3));
    geo.computeVertexNormals(); // без индексов нормали получаются фасеточными

    const centroid = new Float32Array(count * 9);
    const scatter = new Float32Array(count * 9);
    const axis = new Float32Array(count * 9);
    const delay = new Float32Array(count * 3);

    for (let f = 0; f < count; f++) {
      const o = f * 9;
      const cx = (tri[o] + tri[o + 3] + tri[o + 6]) / 3;
      const cy = (tri[o + 1] + tri[o + 4] + tri[o + 7]) / 3;
      const cz = (tri[o + 2] + tri[o + 5] + tri[o + 8]) / 3;

      // направление разлёта — равномерно по сфере (отбраковкой из шара).
      // Раньше здесь был (random - 0.5) по каждой оси: это кубическое
      // облако, и его углы читались как квадрат вокруг знака.
      let dx = 0;
      let dy = 0;
      let dz = 0;
      let l2 = 2;
      while (l2 > 1 || l2 < 1e-6) {
        dx = Math.random() * 2 - 1;
        dy = Math.random() * 2 - 1;
        dz = Math.random() * 2 - 1;
        l2 = dx * dx + dy * dy + dz * dz;
      }
      const l = Math.sqrt(l2);
      dx /= l;
      dy /= l;
      dz /= l;

      // cbrt даёт равномерное заполнение объёма, без комка в центре
      const r = 0.55 + Math.cbrt(Math.random()) * 1.0;
      // подмешиваем направление «от центра знака», чтобы разлёт читался
      const len = Math.hypot(cx, cy) || 1;
      const sx = (dx * 0.72 + (cx / len) * 0.42) * r;
      const sy = (dy * 0.72 + (cy / len) * 0.42) * r;
      const sz = dz * r * 0.85;

      const ax = Math.random() - 0.5;
      const ay = Math.random() - 0.5;
      const az = Math.random() - 0.5;

      // осколки слева собираются первыми — сборка читается как жест
      const d = ((cx + 1) / 2) * 0.34 + Math.random() * 0.14;

      for (let k = 0; k < 3; k++) {
        const p = o + k * 3;
        centroid[p] = cx;
        centroid[p + 1] = cy;
        centroid[p + 2] = cz;
        scatter[p] = sx;
        scatter[p + 1] = sy;
        scatter[p + 2] = sz;
        axis[p] = ax;
        axis[p + 1] = ay;
        axis[p + 2] = az;
        delay[f * 3 + k] = d;
      }
    }

    geo.setAttribute('aCentroid', new THREE.BufferAttribute(centroid, 3));
    geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
    geo.setAttribute('aAxis', new THREE.BufferAttribute(axis, 3));
    geo.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uProgress: { value: reduced ? 1 : 0 },
        uDark: { value: new THREE.Color('#4a1f02') },
        uMid: { value: new THREE.Color('#fa8a16') },
        uHot: { value: new THREE.Color('#ffd9a0') },
      },
    });

    const group = new THREE.Group();
    group.add(new THREE.Mesh(geo, material));
    scene.add(group);

    /* --- размер --- */
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* --- цикл --- */
    let raf = 0;
    const t0 = performance.now();

    const loop = (now: number) => {
      const time = (now - t0) / 1000;
      const p = progressRef.current;

      material.uniforms.uProgress.value = p;

      if (!reduced) {
        // пока собирается — знак доворачивается на место,
        // потом еле заметно покачивается
        const settle = 1 - Math.pow(1 - Math.min(p, 1), 3);
        group.rotation.y = (1 - settle) * -1.05 + Math.sin(time * 0.45) * 0.13 * settle;
        group.rotation.x = (1 - settle) * 0.4 + Math.sin(time * 0.33 + 1.2) * 0.06 * settle;
        group.position.z = (1 - settle) * -1.2;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden />;
}
