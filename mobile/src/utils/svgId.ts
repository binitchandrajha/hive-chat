import { useId } from 'react';

/** Unique, url()-safe id for SVG gradients/patterns (React ids contain colons). */
export function useSvgId(prefix: string): string {
  return `${prefix}${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

/** CSS `linear-gradient(<angle>deg, …)` → SVG x1/y1/x2/y2 (0–1). */
export function angleToPoints(angle: number): { x1: number; y1: number; x2: number; y2: number } {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) / 2;
  const dy = Math.cos(rad) / 2;
  return { x1: 0.5 - dx, y1: 0.5 + dy, x2: 0.5 + dx, y2: 0.5 - dy };
}
