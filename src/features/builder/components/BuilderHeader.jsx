import {
  Boxes,
  LayoutTemplate,
  Grid,
  Magnet,
  Undo2,
  Redo2,
  Trash2,
  Code2,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { GRID_SIZE_OPTIONS } from '../constants/builder_defaults';
import { AddBoxDropdown } from './AddBoxDropdown';

export const BuilderHeader = ({
  onBackToMenu,
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
  onOpenTemplates,
  onClearCanvas,
  onOpenExport,
  onDownloadHtml,
}) => {
  return (
    <header className="h-13 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between select-none">
      {/* Left: Brand & Main Actions */}
      <div className="flex items-center gap-3">
        {/* Return to Menu Button */}
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-750 transition-colors shadow-xs"
            title="Kembali ke Menu Utama"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>
        )}

        {/* Brand Logo */}
        <div className="flex items-center gap-2 pr-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Boxes className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-zinc-100 tracking-tight">LayoutCraft</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-750">
              Builder
            </span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800" />

        {/* Add Box Dropdown with Presets */}
        <AddBoxDropdown onAddBox={onAddBox} />

        {/* Layout Templates Modal Trigger */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-750 transition-colors shadow-xs"
          title="Browse & load editable layout templates"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-blue-400" />
          <span>Templates</span>
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
            onClick={() => onZoomChange(Math.max(25, zoom - 10))}
            disabled={zoom <= 25}
            className="text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => onZoomChange(100)}
            className="w-10 text-center font-mono text-[11px] text-zinc-300 hover:text-white cursor-pointer"
            title="Click to reset zoom to 100%"
          >
            {zoom}%
          </button>
          <button
            onClick={() => onZoomChange(Math.min(250, zoom + 10))}
            disabled={zoom >= 250}
            className="text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            title="Zoom In"
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
          onClick={onDownloadHtml}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-600/80 border border-blue-800/60 transition-colors shadow-xs"
          title="Download standalone HTML layout file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download HTML</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Export Code</span>
        </button>
      </div>
    </header>
  );
};
