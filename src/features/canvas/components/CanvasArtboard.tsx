import { useRef, type FC, type MouseEvent } from 'react';
import type { LayoutNode } from '@/core/types/element.types';
import type { DeviceViewport } from '@/core/types/studio.types';
import { VIEWPORT_CONFIGS } from '@/core/constants/presets';
import { CanvasRenderer } from './CanvasRenderer';

interface CanvasArtboardProps {
  rootNode: LayoutNode;
  selectedId: string | null;
  hoveredId: string | null;
  viewport: DeviceViewport;
  zoom: number;
  showGrid: boolean;
  isPreview: boolean;
  onSelect: (id: string, e: MouseEvent) => void;
  onHover: (id: string | null, e: MouseEvent) => void;
  onUpdateContent: (id: string, text: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  onCanvasClick: () => void;
  onPasteImage?: (
    dataUrl: string,
    options?: { name?: string; alt?: string; isScreenshot?: boolean }
  ) => void;
}

export const CanvasArtboard: FC<CanvasArtboardProps> = ({
  rootNode,
  selectedId,
  hoveredId,
  viewport,
  zoom,
  showGrid,
  isPreview,
  onSelect,
  onHover,
  onUpdateContent,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onCanvasClick,
  onPasteImage,
}) => {
  const artboardRef = useRef<HTMLDivElement>(null);
  const vpConfig = VIEWPORT_CONFIGS.find((v) => v.id === viewport) || VIEWPORT_CONFIGS[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file.type.startsWith('image/') ||
          /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(file.name) ||
          file.type === ''
        ) {
          const reader = new FileReader();
          reader.onload = (loadEv) => {
            if (typeof loadEv.target?.result === 'string') {
              onPasteImage?.(loadEv.target.result, {
                name: file.name.replace(/\.[^.]+$/, '') || 'Image',
                alt: 'Dropped Image',
                isScreenshot: false,
              });
            }
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
  };

  return (
    <div
      ref={artboardRef}
      tabIndex={0}
      className={`flex-1 relative overflow-auto p-8 flex items-start justify-center transition-all bg-[#09090b] outline-none ${
        showGrid ? 'canvas-grid-pattern' : ''
      }`}
      onClick={() => {
        artboardRef.current?.focus();
        onCanvasClick();
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="transition-all duration-200 origin-top flex flex-col items-center shadow-2xl rounded-lg overflow-hidden my-4"
        style={{
          transform: `scale(${zoom / 100})`,
          width: `${vpConfig.width}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Viewport Info Bar */}
        {!isPreview && (
          <div className="w-full bg-zinc-900 border-b border-zinc-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-400 select-none">
            <span className="font-medium text-zinc-300">
              {vpConfig.name} ({vpConfig.width}px)
            </span>
            <span>{zoom}% Zoom</span>
          </div>
        )}

        {/* Root Node Canvas */}
        <div className="w-full min-h-[680px] bg-zinc-950">
          <CanvasRenderer
            node={rootNode}
            selectedId={selectedId}
            hoveredId={hoveredId}
            isPreview={isPreview}
            onSelect={onSelect}
            onHover={onHover}
            onUpdateContent={onUpdateContent}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        </div>
      </div>
    </div>
  );
};
