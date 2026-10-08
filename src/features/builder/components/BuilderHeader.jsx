import {
  ArrowLeft,
  Plus,
  Grid,
  Magnet,
  Undo2,
  Redo2,
  Trash2,
  Code2,
  Sparkles,
} from 'lucide-react';
import { GRID_SIZE_OPTIONS, BOX_PRESETS } from '../constants/builder_defaults';

export const BuilderHeader = ({
  onBack,
  gridSize,
  onChangeGridSize,
  showGrid,
  onToggleGrid,
  snapToGrid,
  onToggleSnap,
  zoom,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddBox,
  onClearCanvas,
  onOpenExport,
  onApplyToStudio,
}) => {
  return (
    <header className="h-13 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between select-none">
      {/* Left: Back to Studio & Add Box */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
          title="Return to visual studio"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Studio</span>
        </button>

        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* Add Box Button */}
        <button
          onClick={() => onAddBox(BOX_PRESETS[0])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm shadow-blue-500/25"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Box</span>
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center: Grid Controls & Snapping */}
      <div className="flex items-center gap-2.5">
        {/* Toggle Grid Lines */}
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            showGrid
              ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
              : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
          title="Toggle Grid Lines"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Grid</span>
        </button>

        {/* Toggle Grid Snapping */}
        <button
          onClick={onToggleSnap}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            snapToGrid
              ? 'bg-emerald-600/15 text-emerald-400 border-emerald-500/30'
              : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
          title="Snap to Grid"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap {snapToGrid ? 'On' : 'Off'}</span>
        </button>

        {/* Grid Step Options */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-mono">
          {GRID_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => onChangeGridSize(size)}
              className={`px-2 py-1 rounded transition-colors ${
                gridSize === size
                  ? 'bg-zinc-800 text-blue-400 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="text-zinc-400 hover:text-zinc-200"
          >
            -
          </button>
          <span className="w-8 text-center font-mono text-[11px] text-zinc-300">{zoom}%</span>
          <button
            onClick={() => onZoomChange(Math.min(150, zoom + 10))}
            className="text-zinc-400 hover:text-zinc-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClearCanvas}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          title="Clear All Boxes"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Export Code</span>
        </button>

        <button
          onClick={onApplyToStudio}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm shadow-emerald-500/25"
          title="Convert this layout into structured studio blocks"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Apply to Studio</span>
        </button>
      </div>
    </header>
  );
};
