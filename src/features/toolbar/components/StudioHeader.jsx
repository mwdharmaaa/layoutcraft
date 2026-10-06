import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Grid,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Code2,
  Trash2,
  Layout,
  Keyboard,
} from 'lucide-react';

export const StudioHeader = ({
  viewport,
  onViewportChange,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isPreview,
  onTogglePreview,
  onOpenExport,
  onClearCanvas,
  onOpenShortcuts,
}) => {
  return (
    <header className="h-13 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-zinc-100 tracking-tight leading-none">LayoutCraft</h1>
            <span className="text-[10px] text-zinc-500 font-mono">Visual Frontend Studio</span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800 mx-1" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Controls: Viewports & Zoom */}
      <div className="flex items-center gap-3">
        {/* Device Switcher */}
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          {[
            { id: 'desktop', icon: Monitor, label: 'Desktop' },
            { id: 'laptop', icon: Laptop, label: 'Laptop' },
            { id: 'tablet', icon: Tablet, label: 'Tablet' },
            { id: 'mobile', icon: Smartphone, label: 'Mobile' },
          ].map((device) => {
            const Icon = device.icon;
            return (
              <button
                key={device.id}
                onClick={() => onViewportChange(device.id)}
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === device.id
                    ? 'bg-zinc-800 text-blue-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={device.label}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            className="text-zinc-400 hover:text-zinc-200 p-0.5"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-[11px] text-zinc-300">{zoom}%</span>
          <button
            onClick={() => onZoomChange(Math.min(150, zoom + 10))}
            className="text-zinc-400 hover:text-zinc-200 p-0.5"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grid Overlay Toggle */}
        <button
          onClick={onToggleGrid}
          className={`p-1.5 rounded-lg border transition-colors ${
            showGrid
              ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
              : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
          }`}
          title="Toggle Canvas Grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Actions: Shortcuts, Clear, Preview, Export */}
      <div className="flex items-center gap-2">
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onClearCanvas}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          title="Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePreview}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            isPreview
              ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
              : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-850'
          }`}
        >
          {isPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isPreview ? 'Edit Mode' : 'Live Preview'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm shadow-blue-500/25"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Export Code</span>
        </button>
      </div>
    </header>
  );
};
