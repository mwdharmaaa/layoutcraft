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
      <div className="flex items-center justify-between border-b border-white/10 pb-1">
        <label className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase tracking-[0.25em]">
          RESIZABLE EDGES
        </label>
        <span className="text-[10px] text-slate-500 font-mono-tech uppercase">
          {Object.values(currentSides).filter(Boolean).length}/4 ACTIVE
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
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-mono-tech uppercase tracking-wider border transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/15 border-white/40 text-white shadow-xs font-semibold'
                  : 'bg-[#141517] border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-white' : 'bg-slate-600'
                  }`}
                />
                {label}
              </span>
              <span className="text-[9px] font-mono-tech text-slate-500">{axis}</span>
            </button>
          );
        })}
      </div>

      {/* Fast Presets */}
      <div className="flex items-center gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => handleSetPreset('all')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded-full bg-[#141517] hover:bg-white/10 border border-white/10 text-[10px] font-mono-tech tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Enable all 4 sides"
        >
          <CheckSquare className="w-2.5 h-2.5 text-slate-300" />
          <span>ALL 4</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetPreset('width')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded-full bg-[#141517] hover:bg-white/10 border border-white/10 text-[10px] font-mono-tech tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Width only (Left & Right)"
        >
          <ArrowLeftRight className="w-2.5 h-2.5 text-slate-300" />
          <span>WIDTH</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetPreset('height')}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded-full bg-[#141517] hover:bg-white/10 border border-white/10 text-[10px] font-mono-tech tracking-wider text-slate-400 hover:text-white transition-all cursor-pointer"
          title="Height only (Top & Bottom)"
        >
          <ArrowUpDown className="w-2.5 h-2.5 text-slate-300" />
          <span>HEIGHT</span>
        </button>
      </div>
    </div>
  );
};
