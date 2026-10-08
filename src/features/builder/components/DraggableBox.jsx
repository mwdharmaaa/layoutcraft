import { useBoxDrag } from '../hooks/useBoxDrag';
import { useBoxResize } from '../hooks/useBoxResize';
import { ResizeHandles } from './ResizeHandles';
import { Copy, Trash2, Move } from 'lucide-react';

export const DraggableBox = ({
  box,
  isSelected,
  zoom,
  gridSize,
  snapToGrid,
  onSelect,
  onUpdateBox,
  onCommitState,
  onDuplicate,
  onDelete,
}) => {
  const { isDragging, handlePointerDown } = useBoxDrag({
    box,
    zoom,
    gridSize,
    snapToGrid,
    onUpdateBox,
    onDragEnd: onCommitState,
  });

  const { isResizing, startResize } = useBoxResize({
    box,
    zoom,
    gridSize,
    snapToGrid,
    onUpdateBox,
    onResizeEnd: onCommitState,
  });

  const isInteracting = isDragging || isResizing;

  return (
    <div
      id={`builder-box-${box.id}`}
      onPointerDown={(e) => {
        onSelect(box.id);
        handlePointerDown(e);
      }}
      style={{
        transform: `translate3d(${box.x}px, ${box.y}px, 0)`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        backgroundColor: box.color,
        borderColor: isSelected ? '#3b82f6' : box.borderColor,
        borderRadius: `${box.borderRadius || 8}px`,
        zIndex: isSelected ? 40 : (box.zIndex || 1),
      }}
      className={`absolute select-none cursor-move border transition-shadow flex flex-col justify-between p-3 ${
        isSelected
          ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/10'
          : 'hover:border-zinc-500 shadow-sm'
      } ${isInteracting ? 'opacity-95' : ''}`}
    >
      {/* Top Header Label & Controls */}
      <div className="flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <Move className="w-3 h-3 text-zinc-400 shrink-0" />
          <span
            style={{ color: box.textColor }}
            className="text-xs font-semibold truncate tracking-tight"
          >
            {box.name}
          </span>
        </div>

        {/* Action Buttons on Box when Selected */}
        {isSelected && (
          <div className="flex items-center gap-1 pointer-events-auto bg-zinc-900/90 backdrop-blur-xs px-1.5 py-0.5 rounded border border-zinc-700">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(box.id);
              }}
              className="p-1 hover:text-blue-400 text-zinc-400 transition-colors"
              title="Duplicate (Ctrl+D)"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(box.id);
              }}
              className="p-1 hover:text-red-400 text-zinc-400 transition-colors"
              title="Delete Box"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Center Dimension Info Badge when selected or dragging/resizing */}
      {isSelected && (
        <div className="absolute -bottom-6 left-0 flex items-center gap-2 pointer-events-none select-none">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-600 text-white font-medium shadow-xs">
            {box.width} × {box.height} px
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            X: {box.x} Y: {box.y}
          </span>
        </div>
      )}

      {/* Resize Handles (Corners & Edges) */}
      {isSelected && <ResizeHandles onStartResize={startResize} />}
    </div>
  );
};
