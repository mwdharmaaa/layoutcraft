import type { FC } from 'react';
import type { ElementStyles } from '@/core/types/element.types';
import { COLOR_PALETTES } from '@/core/constants/presets';

interface TypographySectionProps {
  styles: ElementStyles;
  onChange: (patch: Partial<ElementStyles>) => void;
}

export const TypographySection: FC<TypographySectionProps> = ({ styles, onChange }) => {
  return (
    <div className="space-y-4 text-xs text-zinc-300">
      {/* Font Size & Weight */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-medium text-zinc-400 mb-1">Font Size</label>
          <input
            type="text"
            placeholder="16px / 1.5rem"
            value={styles.fontSize || ''}
            onChange={(e) => onChange({ fontSize: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-zinc-400 mb-1">Weight</label>
          <select
            value={styles.fontWeight || '400'}
            onChange={(e) => onChange({ fontWeight: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-zinc-200"
          >
            <option value="300">300 (Light)</option>
            <option value="400">400 (Regular)</option>
            <option value="500">500 (Medium)</option>
            <option value="600">600 (Semibold)</option>
            <option value="700">700 (Bold)</option>
            <option value="800">800 (Extrabold)</option>
          </select>
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Alignment</label>
        <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800">
          {(['left', 'center', 'right', 'justify'] as const).map((align) => (
            <button
              key={align}
              onClick={() => onChange({ textAlign: align })}
              className={`py-1 rounded text-center capitalize ${
                styles.textAlign === align ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-400 mb-1">Color</label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="#fafafa"
            value={styles.color || ''}
            onChange={(e) => onChange({ color: e.target.value })}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 font-mono text-xs"
          />
        </div>
        <div className="grid grid-cols-10 gap-1">
          {COLOR_PALETTES.slice(1, 11).map((c) => (
            <button
              key={c}
              onClick={() => onChange({ color: c })}
              className="w-5 h-5 rounded border border-zinc-700/60 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
