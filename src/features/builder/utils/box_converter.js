import { generateElementId } from '@/core/utils/id_generator';

export function boxesToStudioRoot(boxes) {
  const sortedBoxes = [...boxes].sort((a, b) => (a.y - b.y) || (a.x - b.x));
  
  const children = sortedBoxes.map((box) => ({
    id: generateElementId('box'),
    name: box.name || 'Layout Box',
    tag: 'div',
    category: 'layout',
    content: box.name || '',
    styles: {
      backgroundColor: box.color || '#18181b',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: box.borderColor || '#27272a',
      borderRadius: `${box.borderRadius || 8}px`,
      color: box.textColor || '#f4f4f5',
      padding: '16px',
      minHeight: `${box.height}px`,
      width: '100%',
      marginBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: '600',
    },
    children: [],
  }));

  return {
    id: 'root-canvas',
    name: 'Canvas Page',
    tag: 'main',
    category: 'layout',
    styles: {
      minHeight: '100%',
      padding: '32px',
      backgroundColor: '#09090b',
      color: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    children,
  };
}

export function boxesToTailwindCode(boxes) {
  const sorted = [...boxes].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));
  const lines = sorted.map((b) => {
    return `    {/* ${b.name || 'Box'} */}
    <div
      style={{ left: '${b.x}px', top: '${b.y}px', width: '${b.width}px', height: '${b.height}px', backgroundColor: '${b.color}', borderColor: '${b.borderColor}' }}
      className="absolute border rounded-lg p-4 flex items-center justify-center font-medium shadow-md"
    >
      <span style={{ color: '${b.textColor}' }}>${b.name}</span>
    </div>`;
  });

  return `<div className="relative w-full min-h-[800px] bg-zinc-950 overflow-hidden border border-zinc-800 rounded-xl">
${lines.join('\n\n')}
</div>`;
}

import { generateStandaloneHtml, generateHtmlSnippet } from './html_exporter';

export { generateStandaloneHtml, generateHtmlSnippet };

export function boxesToHtmlCode(boxes, isStandalone = true) {
  return isStandalone ? generateStandaloneHtml(boxes) : generateHtmlSnippet(boxes);
}
