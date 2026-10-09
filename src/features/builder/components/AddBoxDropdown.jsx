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
      {/* Primary Pill Button Group */}
      <div className="flex items-center rounded-full border border-white/20 bg-[#1e2124]/80 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => onAddBox(BOX_PRESETS[0])}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono-tech tracking-[0.15em] text-slate-200 hover:text-black hover:bg-white transition-all cursor-pointer"
          title="Quick Add Container Box"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD BOX</span>
        </button>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-2 py-1.5 text-slate-300 hover:text-black hover:bg-white border-l border-white/15 transition-all cursor-pointer"
          title="Browse Layout Block Presets"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Presets Popup Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#1c1f23] border border-white/15 rounded-xl shadow-2xl p-2 z-50 text-xs text-slate-300 backdrop-blur-md">
          <div className="px-2 py-1.5 text-[10px] font-mono-tech tracking-[0.2em] text-slate-400 uppercase flex items-center justify-between border-b border-white/10 mb-1">
            <span>Box Layout Presets</span>
            <LayoutGrid className="w-3 h-3 text-slate-400" />
          </div>

          <div className="flex flex-col gap-0.5">
            {BOX_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/10 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    style={{ backgroundColor: preset.color, borderColor: preset.borderColor }}
                    className="w-3 h-3 rounded-xs border shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-medium text-slate-200 group-hover:text-white truncate">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono-tech uppercase tracking-wider">
                      {preset.category || 'Layout'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono-tech text-slate-300 bg-[#141517] px-2 py-0.5 rounded-full border border-white/10 shrink-0">
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
