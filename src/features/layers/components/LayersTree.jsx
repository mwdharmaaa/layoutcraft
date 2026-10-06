import { useState } from 'react';
import { Eye, EyeOff, Trash2, ChevronRight, ChevronDown, Layers } from 'lucide-react';

export const LayersTreeItem = ({
  node,
  selectedId,
  depth = 0,
  onSelect,
  onToggleVisibility,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="text-xs select-none">
      <div
        onClick={() => onSelect(node.id)}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        className={`flex items-center justify-between pr-2 py-1 rounded cursor-pointer transition-colors group ${
          isSelected
            ? 'bg-blue-600/20 text-blue-400 font-medium'
            : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
        }`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 text-zinc-500 hover:text-zinc-300"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <div className="w-4" />
          )}
          <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
            {node.tag}
          </span>
          <span className="truncate text-[11px]">{node.name}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(node.id);
            }}
            className="p-0.5 text-zinc-500 hover:text-zinc-300"
            title="Toggle Visibility"
          >
            {node.isHidden ? <EyeOff className="w-3 h-3 text-red-400" /> : <Eye className="w-3 h-3" />}
          </button>
          {node.id !== 'root-canvas' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              className="p-0.5 text-zinc-500 hover:text-red-400"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <LayersTreeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              depth={depth + 1}
              onSelect={onSelect}
              onToggleVisibility={onToggleVisibility}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const LayersTree = (props) => {
  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      <div className="p-3 border-b border-zinc-800 flex items-center gap-2">
        <Layers className="w-4 h-4 text-zinc-400" />
        <h4 className="text-xs font-semibold text-zinc-300">DOM Layers Tree</h4>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <LayersTreeItem {...props} />
      </div>
    </div>
  );
};
