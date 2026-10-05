import type { LayoutNode } from '@/core/types/element.types';
import { generateElementId } from '@/core/utils/id_generator';

export interface PaletteItem {
  id: string;
  name: string;
  category: 'layout' | 'typography' | 'ui';
  icon: string;
  createNode: () => LayoutNode;
}

export const PALETTE_ITEMS: PaletteItem[] = [
  // Layout Items
  {
    id: 'container-section',
    name: 'Section Box',
    category: 'layout',
    icon: 'Box',
    createNode: () => ({
      id: generateElementId('sec'),
      name: 'Section Box',
      tag: 'section',
      category: 'container',
      styles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingTop: '24px',
        paddingRight: '24px',
        paddingBottom: '24px',
        paddingLeft: '24px',
        backgroundColor: '#121215',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#27272a',
        borderRadius: '12px',
        width: '100%',
      },
      children: [],
    }),
  },
  {
    id: 'flex-row',
    name: 'Flex Row',
    category: 'layout',
    icon: 'Columns2',
    createNode: () => ({
      id: generateElementId('row'),
      name: 'Flex Row',
      tag: 'div',
      category: 'flex',
      styles: {
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        alignItems: 'center',
        width: '100%',
      },
      children: [],
    }),
  },
  {
    id: 'grid-2col',
    name: '2-Col Grid',
    category: 'layout',
    icon: 'Grid2x2',
    createNode: () => ({
      id: generateElementId('grid2'),
      name: '2-Column Grid',
      tag: 'div',
      category: 'grid',
      styles: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '16px',
        width: '100%',
      },
      children: [],
    }),
  },
  {
    id: 'grid-3col',
    name: '3-Col Grid',
    category: 'layout',
    icon: 'LayoutGrid',
    createNode: () => ({
      id: generateElementId('grid3'),
      name: '3-Column Grid',
      tag: 'div',
      category: 'grid',
      styles: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '16px',
        width: '100%',
      },
      children: [],
    }),
  },

  // Typography Items
  {
    id: 'type-h1',
    name: 'Heading H1',
    category: 'typography',
    icon: 'Heading',
    createNode: () => ({
      id: generateElementId('h1'),
      name: 'Heading 1',
      tag: 'h1',
      category: 'typography',
      content: 'Hero Headline',
      styles: { fontSize: '32px', fontWeight: '800', color: '#fafafa', letterSpacing: '-0.5px' },
    }),
  },
  {
    id: 'type-p',
    name: 'Paragraph',
    category: 'typography',
    icon: 'Pilcrow',
    createNode: () => ({
      id: generateElementId('p'),
      name: 'Paragraph',
      tag: 'p',
      category: 'typography',
      content: 'Write descriptive content or explanation here to communicate your design intent.',
      styles: { fontSize: '14px', color: '#a1a1aa', lineHeight: '1.6' },
    }),
  },

  // UI Items
  {
    id: 'ui-button-primary',
    name: 'Primary Button',
    category: 'ui',
    icon: 'MousePointerClick',
    createNode: () => ({
      id: generateElementId('btn'),
      name: 'Primary Button',
      tag: 'button',
      category: 'ui',
      content: 'Action Button',
      styles: {
        fontSize: '14px',
        fontWeight: '600',
        paddingTop: '8px',
        paddingRight: '16px',
        paddingBottom: '8px',
        paddingLeft: '16px',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '8px',
      },
    }),
  },
  {
    id: 'ui-badge',
    name: 'Status Badge',
    category: 'ui',
    icon: 'Tag',
    createNode: () => ({
      id: generateElementId('badge'),
      name: 'Status Badge',
      tag: 'span',
      category: 'ui',
      content: 'Featured',
      styles: {
        fontSize: '12px',
        fontWeight: '600',
        paddingTop: '3px',
        paddingRight: '8px',
        paddingBottom: '3px',
        paddingLeft: '8px',
        backgroundColor: '#27272a',
        color: '#e4e4e7',
        borderRadius: '9999px',
      },
    }),
  },
  {
    id: 'ui-input',
    name: 'Input Field',
    category: 'ui',
    icon: 'TextCursorInput',
    createNode: () => ({
      id: generateElementId('inp'),
      name: 'Input Field',
      tag: 'input',
      category: 'ui',
      attributes: { placeholder: 'Enter email or value...' },
      styles: {
        fontSize: '14px',
        paddingTop: '8px',
        paddingRight: '12px',
        paddingBottom: '8px',
        paddingLeft: '12px',
        backgroundColor: '#18181b',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#27272a',
        borderRadius: '6px',
        color: '#fafafa',
        width: '100%',
      },
    }),
  },
];
