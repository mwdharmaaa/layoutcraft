import { useBoxDrag } from '../hooks/useBoxDrag';
import { useBoxResize } from '../hooks/useBoxResize';
import { ResizeHandles } from './ResizeHandles';
import { Copy, Trash2, Move, Plus } from 'lucide-react';
import { DEFAULT_RESIZABLE_SIDES } from '../constants/builder_defaults';

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
  onAddBelow,
}) => {
  const { isDragging, handlePointerDown } = useBoxDrag({
    box,
    zoom,
    gridSize,
    snapToGrid,
    onUpdateBox,
    onDragEnd: onCommitState,
  });

  const { isResizing, resizingDirection, startResize } = useBoxResize({
    box,
    zoom,
    gridSize,
    snapToGrid,
    onUpdateBox,
    onResizeEnd: onCommitState,
  });

  const resizableSides = box.resizableSides || DEFAULT_RESIZABLE_SIDES;
  const isInteracting = isDragging || isResizing;

  return (
    <div
      id={`builder-box-${box.id}`}
      onClick={(e) => {
        e.stopPropagation();
        if (box?.id) {
          onSelect(box.id);
        }
      }}
      onPointerDown={(e) => {
        if (box?.id) {
          onSelect(box.id);
        }
        handlePointerDown(e);
      }}
      style={{
        transform: `translate3d(${box.x}px, ${box.y}px, 0)`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        backgroundColor: box.color,
        borderColor: isSelected ? 'rgba(255, 255, 255, 0.85)' : box.borderColor,
        borderRadius: `${box.borderRadius || 8}px`,
        zIndex: isSelected ? 40 : (box.zIndex || 1),
      }}
      className={`absolute select-none cursor-move border transition-shadow flex flex-col justify-between p-3 ${
        isSelected
          ? isResizing
            ? 'ring-2 ring-white/70 shadow-2xl shadow-black/80'
            : 'ring-1 ring-white/50 shadow-xl shadow-black/60'
          : 'hover:border-white/30 shadow-sm'
      } ${isInteracting ? 'opacity-95' : ''}`}
    >
      {/* Top Header Label & Controls */}
      <div className="flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 min-w-0 pointer-events-auto cursor-grab active:cursor-grabbing px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors">
          <Move className="w-3 h-3 text-slate-400 shrink-0" />
          <span
            style={{ color: box.textColor }}
            className="text-xs font-mono-tech font-semibold truncate tracking-wider"
          >
            {box.name}
          </span>
        </div>

        {/* Action Buttons on Box when Selected */}
        {isSelected && (
          <div className="flex items-center gap-1 pointer-events-auto bg-[#181a1d]/95 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddBelow?.(box);
              }}
              className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
              title="Add Box Below"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(box.id);
              }}
              className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
              title="Duplicate (Ctrl+D)"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(box.id);
              }}
              className="p-1 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
              title="Delete Box"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Center Dimension Info Badge when selected or dragging/resizing */}
      {isSelected && (
        <div className="absolute -bottom-6 left-0 flex items-center gap-2 pointer-events-none select-none whitespace-nowrap">
          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-white text-black font-bold shadow-xs">
            {box.width} × {box.height} PX
            {isResizing && resizingDirection ? ` (${resizingDirection.toUpperCase()})` : ''}
          </span>
          <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#141517] text-slate-300 border border-white/10">
            X: {box.x} Y: {box.y}
          </span>
          <span className="text-[9px] font-mono-tech text-slate-400 bg-[#141517] px-2 py-0.5 rounded-full border border-white/10 hidden sm:inline-block">
            DRAG EDGES TO RESIZE
          </span>
        </div>
      )}

      {/* Resize Handles (Corners & Full Side Rails) */}
      {isSelected && (
        <ResizeHandles
          onStartResize={startResize}
          resizableSides={resizableSides}
          activeDirection={resizingDirection}
        />
      )}
    </div>
  );
};
