import type { ViewportConfig } from '../types/studio.types';

export const VIEWPORT_CONFIGS: ViewportConfig[] = [
  { id: 'desktop', name: 'Desktop', width: 1280, height: 800 },
  { id: 'laptop', name: 'Laptop', width: 1024, height: 680 },
  { id: 'tablet', name: 'Tablet', width: 768, height: 900 },
  { id: 'mobile', name: 'Mobile', width: 375, height: 720 },
];

export const COLOR_PALETTES = [
  'transparent',
  '#09090b',
  '#121215',
  '#18181b',
  '#27272a',
  '#3f3f46',
  '#71717a',
  '#a1a1aa',
  '#e4e4e7',
  '#fafafa',
  '#2563eb',
  '#3b82f6',
  '#059669',
  '#10b981',
  '#d97706',
  '#f59e0b',
  '#dc2626',
  '#ef4444',
  '#7c3aed',
  '#8b5cf6',
];

export const SPACING_PRESETS = ['0px', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px'];
export const RADIUS_PRESETS = ['0px', '4px', '6px', '8px', '12px', '16px', '24px', '9999px'];

export const SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Subtle', value: '0 1px 2px 0 rgba(0, 0, 0, 0.4)' },
  { label: 'Medium', value: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)' },
  { label: 'Elevated', value: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)' },
  { label: 'Blue Glow', value: '0 0 25px rgba(59, 130, 246, 0.35)' },
  { label: 'Border Ring', value: '0 0 0 1px rgba(255, 255, 255, 0.12)' },
];

export const FONT_PRESETS = [
  { label: 'System Sans', value: 'system-ui, -apple-system, sans-serif' },
  { label: 'Inter', value: '"Inter", sans-serif' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { label: 'Syne / Display', value: '"Syne", sans-serif' },
  { label: 'Serif Elegant', value: 'Georgia, serif' },
];
