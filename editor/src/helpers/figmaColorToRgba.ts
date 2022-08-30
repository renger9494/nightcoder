import ObjectKeys from '@/utils/types/ObjectKeys';

export function figmaToRgbaStyle(color: ObjectKeys<number>, a?: number): string {
  const { r, g, b } = color;
  if (a === undefined) a = 1;
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(a * 100) / 100})`;
}
