export const DEFAULT_GRID_SIZE = 20;

export const GRID_SIZE_OPTIONS = [10, 20, 30, 40];

export const BOX_COLOR_PALETTES = [
  { id: 'zinc', bg: '#18181b', border: '#27272a', text: '#f4f4f5', name: 'Zinc' },
  { id: 'blue', bg: '#1e3a5f', border: '#2563eb', text: '#93c5fd', name: 'Blue' },
  { id: 'indigo', bg: '#312e81', border: '#4f46e5', text: '#c7d2fe', name: 'Indigo' },
  { id: 'emerald', bg: '#064e3b', border: '#059669', text: '#a7f3d0', name: 'Emerald' },
  { id: 'amber', bg: '#451a03', border: '#d97706', text: '#fde68a', name: 'Amber' },
  { id: 'purple', bg: '#3b0764', border: '#7c3aed', text: '#e9d5ff', name: 'Purple' },
  { id: 'rose', bg: '#4c0519', border: '#e11d48', text: '#fecdd3', name: 'Rose' },
  { id: 'card', bg: '#121215', border: '#3f3f46', text: '#e4e4e7', name: 'Dark Card' },
];

export const BOX_PRESETS = [
  {
    name: 'Container Box',
    width: 320,
    height: 200,
    color: '#18181b',
    borderColor: '#27272a',
    textColor: '#f4f4f5',
  },
  {
    name: 'Header Box',
    width: 720,
    height: 80,
    color: '#121215',
    borderColor: '#3f3f46',
    textColor: '#fafafa',
  },
  {
    name: 'Card Box',
    width: 240,
    height: 180,
    color: '#1e3a5f',
    borderColor: '#2563eb',
    textColor: '#93c5fd',
  },
  {
    name: 'Sidebar Box',
    width: 220,
    height: 380,
    color: '#121215',
    borderColor: '#27272a',
    textColor: '#e4e4e7',
  },
];

export const INITIAL_BUILDER_BOXES = [
  {
    id: 'box-1',
    name: 'Header Banner',
    x: 40,
    y: 40,
    width: 760,
    height: 80,
    color: '#1e3a5f',
    borderColor: '#2563eb',
    textColor: '#93c5fd',
    borderRadius: 8,
    zIndex: 1,
  },
  {
    id: 'box-2',
    name: 'Left Sidebar',
    x: 40,
    y: 140,
    width: 200,
    height: 300,
    color: '#18181b',
    borderColor: '#27272a',
    textColor: '#f4f4f5',
    borderRadius: 8,
    zIndex: 1,
  },
  {
    id: 'box-3',
    name: 'Main Content',
    x: 260,
    y: 140,
    width: 540,
    height: 300,
    color: '#121215',
    borderColor: '#3f3f46',
    textColor: '#e4e4e7',
    borderRadius: 8,
    zIndex: 1,
  },
];
