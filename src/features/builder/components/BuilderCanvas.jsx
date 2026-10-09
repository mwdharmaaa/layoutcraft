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
      className="flex-1 min-w-0 h-full relative overflow-auto p-8 sm:p-12 flex bg-transparent select-none scroll-smooth z-10"
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
          className="relative bg-[#181a1d]/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transition-transform duration-75 backdrop-blur-xs"
        >
          {/* Canvas Top Bar Indicator */}
          <div
            style={{
              transform: `scale(${1 / scale})`,
              transformOrigin: 'top left',
            }}
            className="absolute top-4 left-5 flex items-center gap-2 pointer-events-none z-10"
          >
            <span className="text-[10px] font-mono-tech tracking-[0.15em] uppercase text-slate-400 bg-[#141517]/90 px-3 py-1 rounded-full border border-white/10 shadow-sm">
              GRID: {gridSize}PX {snapToGrid ? '(SNAP ON)' : '(SNAP OFF)'}
            </span>
            <span className="text-[10px] font-mono-tech tracking-[0.15em] uppercase text-slate-400 bg-[#141517]/90 px-3 py-1 rounded-full border border-white/10 shadow-sm">
              {boxes.length} {boxes.length === 1 ? 'BOX' : 'BOXES'}
            </span>
            <span className="text-[10px] font-mono-tech tracking-[0.15em] uppercase text-slate-400 bg-[#141517]/90 px-3 py-1 rounded-full border border-white/10 shadow-sm hidden sm:inline-block">
              CANVAS: 1280 × {canvasHeight}PX
            </span>
          </div>

          {/* Empty Canvas Placeholder */}
          {boxes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none">
              <span className="text-[10px] font-mono-tech tracking-[0.3em] text-slate-400 uppercase block mb-2">
                EMPTY BOARD // 1280PX
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mb-2">
                Canvas is Ready
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-6 font-sans">
                Click the button below or double-click anywhere on the canvas to start placing layout blocks.
              </p>
              {onAddBox && (
                <button
                  type="button"
                  onClick={() => onAddBox()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 bg-[#1e2124]/80 hover:bg-white hover:text-black text-xs font-mono-tech tracking-[0.2em] text-slate-200 transition-all transform hover:translate-y-0.5 cursor-pointer shadow-xl shadow-black/40"
                >
                  <span>+ ADD FIRST BOX</span>
                </button>
              )}
            </div>
          )}

          {/* Draggable & Resizable Boxes */}
          {boxes.map((box) => (
            <DraggableBox
              key={box.id}
              box={box}
              isSelected={Boolean(selectedBoxId && box.id && selectedBoxId === box.id)}
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
            className="absolute bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none opacity-60"
          >
            <span className="text-[10px] font-mono-tech tracking-[0.2em] uppercase text-slate-400 bg-[#141517]/90 px-4 py-1.5 rounded-full border border-white/10 shadow-sm">
              CANVAS DEPTH: {canvasHeight}PX // SCROLLABLE WORKSPACE
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
