import {
  BOX_COLOR_PALETTES,
} from '../constants/builder_defaults';
import { ResizableSidesControl } from './ResizableSidesControl';
import { Sliders, Layers, Trash2, Copy } from 'lucide-react';

export const BoxPropertyBar = ({
  selectedBox,
  onUpdateBox,
  onDuplicateBox,
  onDeleteBox,
}) => {
  if (!selectedBox) {
    return (
      <aside className="w-80 shrink-0 bg-[#1c1f23]/95 backdrop-blur-md border-l border-white/10 p-6 flex flex-col items-center justify-center text-center select-none text-slate-500 text-xs z-20">
        <Sliders className="w-6 h-6 mb-3 text-slate-500" />
        <p className="font-mono-tech font-bold uppercase tracking-[0.2em] text-slate-300">NO BOX SELECTED</p>
        <p className="text-[11px] text-slate-500 mt-1 font-sans">
          Click on any box on the canvas to configure dimensions, color scheme, and layers.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 bg-[#1c1f23]/95 backdrop-blur-md border-l border-white/10 flex flex-col h-full overflow-y-auto select-none p-5 space-y-5 text-xs text-slate-300 z-20">
      {/* Box Name */}
      <div>
        <label className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.25em] block mb-1.5 pb-1 border-b border-white/10">
          BOX LABEL
        </label>
        <input
          type="text"
          value={selectedBox.name}
          onChange={(e) => onUpdateBox(selectedBox.id, { name: e.target.value })}
          className="w-full bg-[#141517] border border-white/10 rounded-lg px-3 py-1.5 text-slate-100 font-sans text-xs focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 font-medium"
        />
      </div>

      {/* Dimensions & Position */}
      <div>
        <label className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.25em] block mb-2 pb-1 border-b border-white/10">
          TRANSFORM (PX)
        </label>
        <div className="grid grid-cols-2 gap-2 font-mono-tech">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">X</span>
            <input
              type="number"
              value={selectedBox.x}
              onChange={(e) => onUpdateBox(selectedBox.id, { x: Number(e.target.value) || 0 })}
              className="w-full bg-[#141517] border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">Y</span>
            <input
              type="number"
              value={selectedBox.y}
              onChange={(e) => onUpdateBox(selectedBox.id, { y: Number(e.target.value) || 0 })}
              className="w-full bg-[#141517] border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">WIDTH</span>
            <input
              type="number"
              value={selectedBox.width}
              onChange={(e) => onUpdateBox(selectedBox.id, { width: Math.max(40, Number(e.target.value) || 40) })}
              className="w-full bg-[#141517] border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">HEIGHT</span>
            <input
              type="number"
              value={selectedBox.height}
              onChange={(e) => onUpdateBox(selectedBox.id, { height: Math.max(40, Number(e.target.value) || 40) })}
              className="w-full bg-[#141517] border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
            />
          </div>
        </div>
      </div>

      {/* Resizable Edges Configuration */}
      <ResizableSidesControl
        selectedBox={selectedBox}
        onUpdateBox={onUpdateBox}
      />

      {/* Color Preset Palette */}
      <div>
        <label className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.25em] block mb-2 pb-1 border-b border-white/10">
          COLOR SCHEME
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BOX_COLOR_PALETTES.map((palette) => (
            <button
              key={palette.id}
              onClick={() =>
                onUpdateBox(selectedBox.id, {
                  color: palette.bg,
                  borderColor: palette.border,
                  textColor: palette.text,
                })
              }
              style={{ backgroundColor: palette.bg, borderColor: palette.border }}
              className={`h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                selectedBox.color === palette.bg ? 'ring-2 ring-white scale-105 shadow-md' : 'hover:scale-105 hover:border-white/40'
              }`}
              title={palette.name}
            />
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.25em]">
            CORNER RADIUS
          </label>
          <span className="font-mono-tech text-[10px] text-slate-300 bg-[#141517] px-2 py-0.5 rounded-full border border-white/10">
            {selectedBox.borderRadius || 8}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="32"
          step="2"
          value={selectedBox.borderRadius || 8}
          onChange={(e) => onUpdateBox(selectedBox.id, { borderRadius: Number(e.target.value) })}
          className="w-full accent-white cursor-pointer"
        />
      </div>

      {/* Layer Depth (Z-Index) */}
      <div>
        <label className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.25em] block mb-1.5 pb-1 border-b border-white/10">
          LAYER STACK (Z-INDEX)
        </label>
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="number"
            min="1"
            max="100"
            value={selectedBox.zIndex || 1}
            onChange={(e) => onUpdateBox(selectedBox.id, { zIndex: Number(e.target.value) || 1 })}
            className="w-20 bg-[#141517] border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 font-mono-tech text-xs focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
        <button
          onClick={() => onDuplicateBox(selectedBox.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-white/20 bg-[#1e2124]/80 hover:bg-[#282c31] hover:border-white text-slate-200 hover:text-white transition-all text-xs font-mono-tech tracking-[0.15em] cursor-pointer shadow-sm"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>DUPLICATE BOX</span>
        </button>
        <button
          onClick={() => onDeleteBox(selectedBox.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-red-500/30 bg-red-950/30 hover:bg-red-900/40 text-red-300 hover:text-red-200 transition-all text-xs font-mono-tech tracking-[0.15em] cursor-pointer shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>DELETE BOX</span>
        </button>
      </div>
    </aside>
  );
};
