import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const CanvasZoomControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <aside className="absolute bottom-6 right-6 z-30 select-none pointer-events-auto">
      <div className="flex items-center gap-1 bg-[#1c1f23]/90 backdrop-blur-md border border-white/15 rounded-full px-2.5 py-1 shadow-2xl">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= 25}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Zoom Out (Ctrl - or Pinch)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetZoom}
          className="px-2 py-0.5 font-mono-tech text-[11px] font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer min-w-14 text-center"
          title="Reset Zoom to 100%"
        >
          {zoom}%
        </button>

        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= 250}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Zoom In (Ctrl + or Pinch)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        <button
          type="button"
          onClick={onResetZoom}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      <div className="mt-1 text-center">
        <span className="text-[9px] font-mono-tech text-slate-500 uppercase tracking-wider">
          Pinch or Ctrl+Scroll to zoom
        </span>
      </div>
    </aside>
  );
};
