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
    <header className="relative z-20 h-15 bg-[#181a1d]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Brand & Main Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Return to Menu Button */}
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-[#1e2124]/80 hover:bg-white hover:text-black text-[11px] font-mono-tech tracking-[0.15em] text-slate-200 transition-all cursor-pointer shadow-sm"
            title="Kembali ke Menu Utama"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MENU</span>
          </button>
        )}

        {/* Brand Logo & Moniker */}
        <div className="flex items-center gap-2">
          <span className="font-display text-sm sm:text-base font-black tracking-[0.15em] text-white">
            LAYOUTCRAFT
          </span>
          <span className="text-[9px] font-mono-tech tracking-[0.2em] text-slate-400 uppercase border border-white/15 px-2 py-0.5 rounded-full bg-white/5 hidden lg:inline-block">
            BUILDER // V2.5
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

        {/* Add Box Dropdown with Presets */}
        <AddBoxDropdown onAddBox={onAddBox} />

        {/* Layout Templates Modal Trigger */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 bg-[#1e2124]/80 hover:bg-white hover:text-black text-[11px] font-mono-tech tracking-[0.15em] text-slate-200 transition-all cursor-pointer shadow-sm group"
          title="Browse starter layout templates"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-slate-300 group-hover:text-black transition-colors" />
          <span className="hidden sm:inline">TEMPLATES</span>
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-[#141517] border border-white/10 rounded-full p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Grid Controls & Snapping */}
      <div className="hidden md:flex items-center gap-2">
        {/* Toggle Grid Lines */}
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono-tech tracking-[0.15em] uppercase border transition-all cursor-pointer ${
            showGrid
              ? 'bg-white/15 text-white border-white/40 shadow-xs'
              : 'bg-transparent text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle Grid Lines"
        >
          <Grid className="w-3 h-3" />
          <span>GRID</span>
        </button>

        {/* Toggle Grid Snapping */}
        <button
          onClick={onToggleSnap}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono-tech tracking-[0.15em] uppercase border transition-all cursor-pointer ${
            snapToGrid
              ? 'bg-white/15 text-white border-white/40 shadow-xs'
              : 'bg-transparent text-slate-400 border-white/10 hover:text-white hover:bg-white/5'
          }`}
          title="Snap to Grid"
        >
          <Magnet className="w-3 h-3" />
          <span>SNAP {snapToGrid ? 'ON' : 'OFF'}</span>
        </button>

        {/* Grid Step Options */}
        <div className="flex items-center bg-[#141517] border border-white/10 rounded-full p-0.5 text-[10px] font-mono-tech tracking-wider">
          {GRID_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => onChangeGridSize(size)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                gridSize === size
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {size}PX
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-[#141517] px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-mono-tech">
          <button
            onClick={() => onZoomChange(Math.max(25, zoom - 10))}
            disabled={zoom <= 25}
            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer px-1"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={() => onZoomChange(100)}
            className="w-9 text-center font-mono-tech text-slate-200 hover:text-white cursor-pointer"
            title="Reset zoom to 100%"
          >
            {zoom}%
          </button>
          <button
            onClick={() => onZoomChange(Math.min(250, zoom + 10))}
            disabled={zoom >= 250}
            className="text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer px-1"
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
          className="p-1.5 rounded-full border border-white/10 bg-transparent hover:border-red-500/40 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
          title="Clear All Boxes"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onDownloadHtml}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/30 bg-white hover:bg-slate-200 text-black text-[11px] font-mono-tech tracking-[0.15em] font-bold transition-all shadow-md cursor-pointer"
          title="Download standalone HTML layout file"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">HTML</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-[#1e2124]/80 hover:bg-[#282c31] hover:border-white text-[11px] font-mono-tech tracking-[0.15em] text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
          title="Export Code Snippets"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EXPORT</span>
        </button>
      </div>
    </header>
  );
};
