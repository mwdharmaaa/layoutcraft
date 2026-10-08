import { useRef } from 'react';
import { DraggableBox } from './DraggableBox';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { CanvasZoomControls } from './CanvasZoomControls';

export const BuilderCanvas = ({
  boxes,
  selectedBoxId,
  gridSize,
  showGrid,
  snapToGrid,
  zoom,
  onZoomChange,
  onAddBox,
  onSelectBox,
  onUpdateBox,
  onCommitState,
  onDuplicateBox,
  onDeleteBox,
}) => {
  const containerRef = useRef(null);
  const { zoomIn, zoomOut, resetZoom } = useCanvasZoom({
    zoom,
    onZoomChange,
    containerRef,
  });

  const maxBoxBottom = boxes.reduce(
    (max, b) => Math.max(max, (b.y || 0) + (b.height || 0)),
    0
  );
  const canvasHeight = Math.max(4800, maxBoxBottom + 1600);
  const scale = (zoom || 100) / 100;

  const scaledGridSize = gridSize / scale;
  const scaledLineWidth = (1 / scale).toFixed(3);

  const gridStyle = showGrid
    ? {
        backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
        backgroundPosition: 'center top',
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.07) ${scaledLineWidth}px, transparent ${scaledLineWidth}px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.07) ${scaledLineWidth}px, transparent ${scaledLineWidth}px)
        `,
      }
    : {};

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectBox(null);
        }
      }}
      className="flex-1 min-w-0 h-full relative overflow-auto p-8 sm:p-12 flex bg-zinc-950 select-none scroll-smooth"
    >
      {/* Sizer Wrapper for Accurate Scaled Scroll Bounds */}
      <div
        style={{
          width: `${1280 * scale}px`,
          minHeight: `${canvasHeight * scale}px`,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onSelectBox(null);
          }
        }}
        className="relative flex flex-col items-center pb-32 mx-auto my-0 shrink-0"
      >
        {/* Canvas Board Surface */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: '1280px',
            minHeight: `${canvasHeight}px`,
            ...gridStyle,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onSelectBox(null);
            }
          }}
          onDoubleClick={(e) => {
            if (e.target === e.currentTarget && onAddBox) {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = (e.clientX - rect.left) / scale;
              const clickY = (e.clientY - rect.top) / scale;
              onAddBox(undefined, { x: Math.max(0, clickX - 100), y: Math.max(0, clickY - 40) });
            }
          }}
          className="relative bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden transition-transform duration-75"
        >
          {/* Canvas Top Bar Indicator */}
          <div
            style={{
              transform: `scale(${1 / scale})`,
              transformOrigin: 'top left',
            }}
            className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none z-10"
          >
            <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
              Grid: {gridSize}px {snapToGrid ? '(Snap On)' : '(Snap Off)'}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
              {boxes.length} {boxes.length === 1 ? 'Box' : 'Boxes'}
            </span>
            <span className="text-[11px] font-mono text-blue-400/80 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 hidden sm:inline-block">
              Canvas: 1280 × {canvasHeight}px
            </span>
          </div>

          {/* Empty Canvas Placeholder */}
          {boxes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
              <p className="text-zinc-400 text-sm font-medium">Canvas is ready</p>
              <p className="text-zinc-600 text-xs mt-1 mb-4">
                Click button below or double-click anywhere to place your first box
              </p>
              {onAddBox && (
                <button
                  type="button"
                  onClick={() => onAddBox()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  + Add First Box
                </button>
              )}
            </div>
          )}

          {/* Draggable & Resizable Boxes */}
          {boxes.map((box) => (
            <DraggableBox
              key={box.id}
              box={box}
              isSelected={selectedBoxId === box.id}
              zoom={zoom}
              gridSize={gridSize}
              snapToGrid={snapToGrid}
              onSelect={onSelectBox}
              onUpdateBox={onUpdateBox}
              onCommitState={onCommitState}
              onDuplicate={onDuplicateBox}
              onDelete={onDeleteBox}
              onAddBelow={(targetBox) =>
                onAddBox?.(undefined, {
                  x: targetBox.x,
                  y: targetBox.y + targetBox.height + 20,
                })
              }
            />
          ))}

          {/* Canvas Bottom Depth Indicator */}
          <div
            style={{
              transform: `scale(${1 / scale})`,
              transformOrigin: 'bottom center',
            }}
            className="absolute bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none opacity-40"
          >
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-800">
              Canvas Depth: {canvasHeight}px : Scrollable Workspace
            </span>
          </div>
        </div>
      </div>

      {/* Floating Zoom Controls HUD */}
      {onZoomChange && (
        <CanvasZoomControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
        />
      )}
    </div>
  );
};
