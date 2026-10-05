import React from 'react';
import type { ElementStyles } from '@/core/types/element.types';

interface SpacingSectionProps {
  styles: ElementStyles;
  onChange: (patch: Partial<ElementStyles>) => void;
}

export const SpacingSection: React.FC<SpacingSectionProps> = ({ styles, onChange }) => {
  return (
    <div className="space-y-4 text-xs text-zinc-300">
      {/* Sizing: Width & Height */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Dimensions</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Width</span>
            <input
              type="text"
              placeholder="auto / 100% / 300px"
              value={styles.width || ''}
              onChange={(e) => onChange({ width: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Height</span>
            <input
              type="text"
              placeholder="auto / 200px"
              value={styles.height || ''}
              onChange={(e) => onChange({ height: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200"
            />
          </div>
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Padding</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Top</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.paddingTop || ''}
              onChange={(e) => onChange({ paddingTop: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Right</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.paddingRight || ''}
              onChange={(e) => onChange({ paddingRight: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Bottom</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.paddingBottom || ''}
              onChange={(e) => onChange({ paddingBottom: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Left</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.paddingLeft || ''}
              onChange={(e) => onChange({ paddingLeft: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Margin */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Margin</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Top</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.marginTop || ''}
              onChange={(e) => onChange({ marginTop: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Right</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.marginRight || ''}
              onChange={(e) => onChange({ marginRight: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Bottom</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.marginBottom || ''}
              onChange={(e) => onChange({ marginBottom: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 block mb-0.5">Left</span>
            <input
              type="text"
              placeholder="0px"
              value={styles.marginLeft || ''}
              onChange={(e) => onChange({ marginLeft: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-200 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
