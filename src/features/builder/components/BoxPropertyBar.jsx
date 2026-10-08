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
      <aside className="w-72 shrink-0 bg-zinc-900 border-l border-zinc-800 p-4 flex flex-col items-center justify-center text-center select-none text-zinc-500 text-xs">
        <Sliders className="w-6 h-6 mb-2 text-zinc-600" />
        <p className="font-medium text-zinc-400">No Box Selected</p>
        <p className="text-[11px] text-zinc-600 mt-1">
          Click on any box to edit dimensions, color, and layer settings
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-72 shrink-0 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-y-auto select-none p-4 space-y-5 text-xs text-zinc-300">
      {/* Box Name */}
      <div>
        <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5 uppercase tracking-wider">
          Box Label
        </label>
        <input
          type="text"
          value={selectedBox.name}
          onChange={(e) => onUpdateBox(selectedBox.id, { name: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500 font-medium"
        />
      </div>

      {/* Dimensions & Position */}
      <div>
        <label className="text-[11px] font-semibold text-zinc-400 block mb-2 uppercase tracking-wider">
          Transform
        </label>
        <div className="grid grid-cols-2 gap-2 font-mono">
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">X (px)</span>
            <input
              type="number"
              value={selectedBox.x}
              onChange={(e) => onUpdateBox(selectedBox.id, { x: Number(e.target.value) || 0 })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Y (px)</span>
            <input
              type="number"
              value={selectedBox.y}
              onChange={(e) => onUpdateBox(selectedBox.id, { y: Number(e.target.value) || 0 })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Width</span>
            <input
              type="number"
              value={selectedBox.width}
              onChange={(e) => onUpdateBox(selectedBox.id, { width: Math.max(40, Number(e.target.value) || 40) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Height</span>
            <input
              type="number"
              value={selectedBox.height}
              onChange={(e) => onUpdateBox(selectedBox.id, { height: Math.max(40, Number(e.target.value) || 40) })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
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
        <label className="text-[11px] font-semibold text-zinc-400 block mb-2 uppercase tracking-wider">
          Color Scheme
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
              className={`h-7 rounded-md border flex items-center justify-center transition-all ${
                selectedBox.color === palette.bg ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
              }`}
              title={palette.name}
            />
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Corner Radius
          </label>
          <span className="font-mono text-[11px] text-zinc-400">{selectedBox.borderRadius || 8}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="32"
          step="2"
          value={selectedBox.borderRadius || 8}
          onChange={(e) => onUpdateBox(selectedBox.id, { borderRadius: Number(e.target.value) })}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>

      {/* Layer Depth (Z-Index) */}
      <div>
        <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5 uppercase tracking-wider">
          Layer Stack (Z-Index)
        </label>
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-zinc-500" />
          <input
            type="number"
            min="1"
            max="100"
            value={selectedBox.zIndex || 1}
            onChange={(e) => onUpdateBox(selectedBox.id, { zIndex: Number(e.target.value) || 1 })}
            className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 font-mono"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
        <button
          onClick={() => onDuplicateBox(selectedBox.id)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-md transition-colors font-medium"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate Box</span>
        </button>
        <button
          onClick={() => onDeleteBox(selectedBox.id)}
          className="w-full flex items-center justify-center gap-2 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 rounded-md transition-colors font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Box</span>
        </button>
      </div>
    </aside>
  );
};
