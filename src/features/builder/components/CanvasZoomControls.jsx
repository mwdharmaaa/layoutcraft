import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const CanvasZoomControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <aside className="fixed bottom-6 right-80 z-40 select-none pointer-events-auto">
      <div className="flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl px-2 py-1.5 shadow-2xl">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 25}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Zoom Out (Ctrl - or Pinch)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetZoom}
          className="px-2 py-1 font-mono text-[11px] font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-md transition-colors cursor-pointer min-w-14 text-center"
          title="Reset Zoom to 100%"
        >
          {zoom}%
        </button>

        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 250}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Zoom In (Ctrl + or Pinch)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-0.5" />

        <button
          type="button"
          onClick={onResetZoom}
          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="mt-1 text-center">
        <span className="text-[9px] font-mono text-zinc-500 tracking-tight">
          Pinch or Ctrl+Scroll to zoom
        </span>
      </div>
    </aside>
  );
};
