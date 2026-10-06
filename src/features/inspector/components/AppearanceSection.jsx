import { COLOR_PALETTES, RADIUS_PRESETS, SHADOW_PRESETS } from '@/core/constants/presets';

export const AppearanceSection = ({ styles = {}, onChange }) => {
  return (
    <div className="space-y-4 text-xs text-zinc-300">
      {/* Background Color */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Background</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="#18181b or transparent"
            value={styles.backgroundColor || ''}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 font-mono text-xs"
          />
        </div>
        <div className="grid grid-cols-10 gap-1">
          {COLOR_PALETTES.slice(0, 10).map((c) => (
            <button
              key={c}
              onClick={() => onChange({ backgroundColor: c })}
              className="w-5 h-5 rounded border border-zinc-700/60 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Border & Radius */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Border & Radius</label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Width</span>
            <input
              type="text"
              placeholder="1px"
              value={styles.borderWidth || ''}
              onChange={(e) => onChange({ borderWidth: e.target.value, borderStyle: styles.borderStyle || 'solid' })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Color</span>
            <input
              type="text"
              placeholder="#27272a"
              value={styles.borderColor || ''}
              onChange={(e) => onChange({ borderColor: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 font-mono text-[10px]"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Radius</span>
            <input
              type="text"
              placeholder="8px"
              value={styles.borderRadius || ''}
              onChange={(e) => onChange({ borderRadius: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200"
            />
          </div>
        </div>

        <div className="flex gap-1 pt-1">
          {RADIUS_PRESETS.slice(0, 5).map((r) => (
            <button
              key={r}
              onClick={() => onChange({ borderRadius: r })}
              className="px-2 py-0.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px]"
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div className="pt-2 border-t border-zinc-800">
        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Shadow</label>
        <select
          value={styles.boxShadow || 'none'}
          onChange={(e) => onChange({ boxShadow: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200"
        >
          {SHADOW_PRESETS.map((s) => (
            <option key={s.label} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Opacity */}
      <div className="pt-2 border-t border-zinc-800">
        <div className="flex justify-between items-center mb-1">
          <label className="text-[11px] font-medium text-zinc-400">Opacity</label>
          <span className="text-[10px] text-zinc-500">{Math.round(Number(styles.opacity || 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.05"
          max="1"
          step="0.05"
          value={styles.opacity || '1'}
          onChange={(e) => onChange({ opacity: e.target.value })}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
