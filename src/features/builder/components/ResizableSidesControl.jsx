import { ArrowUpDown, ArrowLeftRight, CheckSquare } from 'lucide-react';
import { DEFAULT_RESIZABLE_SIDES } from '../constants/builder_defaults';

export const ResizableSidesControl = ({ selectedBox, onUpdateBox }) => {
  const currentSides = selectedBox?.resizableSides || DEFAULT_RESIZABLE_SIDES;

  const handleToggleSide = (sideKey) => {
    const updated = {
      ...currentSides,
      [sideKey]: !currentSides[sideKey],
    };
    onUpdateBox(selectedBox.id, { resizableSides: updated });
  };

  const handleSetPreset = (presetType) => {
    let nextSides;
    if (presetType === 'all') {
      nextSides = { top: true, right: true, bottom: true, left: true };
    } else if (presetType === 'width') {
      nextSides = { top: false, right: true, bottom: false, left: true };
    } else if (presetType === 'height') {
      nextSides = { top: true, right: false, bottom: true, left: false };
    }
    if (nextSides) {
      onUpdateBox(selectedBox.id, { resizableSides: nextSides });
    }
  };

  const sidesList = [
    { key: 'top', label: 'Top', axis: 'H' },
    { key: 'bottom', label: 'Bottom', axis: 'H' },
    { key: 'left', label: 'Left', axis: 'W' },
    { key: 'right', label: 'Right', axis: 'W' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Resizable Edges
        </label>
        <span className="text-[10px] text-zinc-500 font-mono">
          {Object.values(currentSides).filter(Boolean).length}/4 active
        </span>
      </div>

      {/* 4 Directional Edge Toggles */}
      <div className="grid grid-cols-2 gap-1.5">
        {sidesList.map(({ key, label, axis }) => {
          const isActive = Boolean(currentSides[key]);
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleToggleSide(key)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-medium border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-blue-400' : 'bg-zinc-700'
                  }`}
                />
                {label}
              </span>
              <span className="text-[9px] font-mono text-zinc-500">{axis}</span>
            </button>
          );
        })}
      </div>

      {/* Fast Presets */}
      <div className="flex items-center gap-1 pt-1">
        <button
          type="button"
          onClick={() => handleSetPreset('all')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Enable all 4 sides"
        >
          <CheckSquare className="w-2.5 h-2.5 text-blue-400" />
          <span>All 4</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetPreset('width')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Width only (Left & Right)"
        >
          <ArrowLeftRight className="w-2.5 h-2.5 text-zinc-400" />
          <span>Width</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetPreset('height')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Height only (Top & Bottom)"
        >
          <ArrowUpDown className="w-2.5 h-2.5 text-zinc-400" />
          <span>Height</span>
        </button>
      </div>
    </div>
  );
};
