import { X, Command, Keyboard } from 'lucide-react';
import { SHORTCUTS_DATA } from '../constants/shortcuts_data';

const CATEGORY_TITLES = {
  clipboard: 'Clipboard & Elements',
  canvas: 'Canvas & History',
  navigation: 'Zoom & Viewport',
  studio: 'Studio Operations',
};

export const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = ['clipboard', 'canvas', 'navigation', 'studio'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-blue-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 id="shortcuts-dialog-title" className="text-sm font-semibold text-zinc-100">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-zinc-400">LayoutCraft productivity hotkeys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close shortcuts guide"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {categories.map((cat) => {
            const items = SHORTCUTS_DATA.filter((s) => s.category === cat);
            return (
              <div key={cat} className="space-y-2.5">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  {CATEGORY_TITLES[cat]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-850 hover:border-zinc-750 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-medium text-zinc-200 truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate">
                          {item.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, i) => (
                          <kbd
                            key={i}
                            className="px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-300 bg-zinc-800 border border-zinc-700 rounded shadow-xs"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" />
            <span>macOS commands map directly to Cmd key</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
