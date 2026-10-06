import { Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export const ElementBoundingBox = ({
  node,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  if (node.id === 'root-canvas') return null;

  return (
    <div
      className="absolute -top-7 left-0 flex items-center gap-1 bg-blue-600 text-white text-[11px] px-2 py-0.5 rounded-t-md shadow-md z-30 select-none pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="font-mono font-medium max-w-[120px] truncate">{node.name || node.tag}</span>
      <div className="w-[1px] h-3 bg-blue-400 mx-0.5" />
      {onMoveUp && (
        <button
          onClick={() => onMoveUp(node.id)}
          className="p-0.5 hover:bg-blue-700 rounded transition-colors"
          title="Move Up"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
      )}
      {onMoveDown && (
        <button
          onClick={() => onMoveDown(node.id)}
          className="p-0.5 hover:bg-blue-700 rounded transition-colors"
          title="Move Down"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      )}
      <button
        onClick={() => onDuplicate(node.id)}
        className="p-0.5 hover:bg-blue-700 rounded transition-colors"
        title="Duplicate"
      >
        <Copy className="w-3 h-3" />
      </button>
      <button
        onClick={() => onDelete(node.id)}
        className="p-0.5 hover:bg-red-700 rounded transition-colors"
        title="Delete"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};
