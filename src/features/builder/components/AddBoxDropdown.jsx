import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, LayoutGrid } from 'lucide-react';
import { BOX_PRESETS } from '../constants/builder_defaults';

export const AddBoxDropdown = ({ onAddBox }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelectPreset = (preset) => {
    onAddBox(preset);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative inline-flex items-center">
      {/* Primary Add Button */}
      <button
        type="button"
        onClick={() => onAddBox(BOX_PRESETS[0])}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm shadow-blue-500/25 cursor-pointer"
        title="Quick Add Container Box"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Box</span>
      </button>

      {/* Preset Selector Chevron */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-2 py-1.5 rounded-r-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white border-l border-blue-500/50 transition-colors shadow-sm shadow-blue-500/25 cursor-pointer"
        title="Browse Layout Block Presets"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Presets Popup Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs text-zinc-300 backdrop-blur-md">
          <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800/80 mb-1">
            <span>Box Layout Presets</span>
            <LayoutGrid className="w-3 h-3 text-zinc-500" />
          </div>

          <div className="flex flex-col gap-0.5">
            {BOX_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-zinc-800 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    style={{ backgroundColor: preset.color, borderColor: preset.borderColor }}
                    className="w-3 h-3 rounded-xs border shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-medium text-zinc-200 group-hover:text-white truncate">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {preset.category || 'Layout'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
                  {preset.width} × {preset.height}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
