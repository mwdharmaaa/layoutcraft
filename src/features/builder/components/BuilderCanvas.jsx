import { DraggableBox } from './DraggableBox';

export const BuilderCanvas = ({
  boxes,
  selectedBoxId,
  gridSize,
  showGrid,
  snapToGrid,
  zoom,
  onSelectBox,
  onUpdateBox,
  onCommitState,
  onDuplicateBox,
  onDeleteBox,
}) => {
  const gridStyle = showGrid
    ? {
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
        `,
      }
    : {};

  return (
    <div
      onClick={() => onSelectBox(null)}
      className="flex-1 relative overflow-auto p-10 flex items-start justify-center bg-zinc-950 select-none"
    >
      {/* Canvas Board Surface */}
      <div
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
          width: '1280px',
          minHeight: '860px',
          ...gridStyle,
        }}
        onClick={(e) => {
          // Deselect if clicking on empty canvas surface
          if (e.target === e.currentTarget) {
            onSelectBox(null);
          }
        }}
        className="relative bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden transition-transform duration-100"
      >
        {/* Canvas Top Bar Indicator */}
        <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none z-10">
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
            Grid: {gridSize}px {snapToGrid ? '(Snap On)' : '(Snap Off)'}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
            {boxes.length} {boxes.length === 1 ? 'Box' : 'Boxes'}
          </span>
        </div>

        {/* Empty Canvas Placeholder */}
        {boxes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
            <p className="text-zinc-500 text-sm font-medium">Canvas is empty</p>
            <p className="text-zinc-600 text-xs mt-1">
              Click &quot;+ Add Box&quot; in the top bar to create your first layout block
            </p>
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
          />
        ))}
      </div>
    </div>
  );
};
