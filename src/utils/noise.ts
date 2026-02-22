// Seeded pseudo-random number generator (mulberry32)
export const createRng = (seed: number) => {
  let s = seed | 0;
  return (): number => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  opacity: number;
}

export const generateParticles = (
  count: number,
  seed: number,
  width: number,
  height: number,
): Particle[] => {
  const rng = createRng(seed);
  return Array.from({ length: count }, () => ({
    x: rng() * width,
    y: rng() * height,
    size: 2 + rng() * 6,
    speed: 0.5 + rng() * 2,
    angle: rng() * Math.PI * 2,
    opacity: 0.3 + rng() * 0.7,
  }));
};
