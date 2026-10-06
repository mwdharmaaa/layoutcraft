export const LayoutSection = ({ styles = {}, onChange }) => {
  const display = styles.display || 'block';

  return (
    <div className="space-y-4 text-xs text-zinc-300">
      {/* Display Selector */}
      <div>
        <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Display</label>
        <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800">
          {['block', 'flex', 'grid'].map((type) => (
            <button
              key={type}
              onClick={() => onChange({ display: type })}
              className={`py-1 rounded text-center font-medium capitalize transition-colors ${
                display === type ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Flexbox Controls */}
      {display === 'flex' && (
        <div className="space-y-3 pt-2 border-t border-zinc-800">
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Direction</label>
            <div className="grid grid-cols-2 gap-1 bg-zinc-950 p-1 rounded-md border border-zinc-800">
              {['row', 'column'].map((dir) => (
                <button
                  key={dir}
                  onClick={() => onChange({ flexDirection: dir })}
                  className={`py-1 rounded text-center capitalize ${
                    styles.flexDirection === dir ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Justify Content</label>
            <select
              value={styles.justifyContent || 'flex-start'}
              onChange={(e) => onChange({ justifyContent: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Align Items</label>
            <select
              value={styles.alignItems || 'stretch'}
              onChange={(e) => onChange({ alignItems: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              <option value="stretch">Stretch</option>
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="baseline">Baseline</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid Controls */}
      {display === 'grid' && (
        <div className="space-y-3 pt-2 border-t border-zinc-800">
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Columns</label>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {[1, 2, 3, 4].map((cols) => (
                <button
                  key={cols}
                  onClick={() => onChange({ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` })}
                  className="py-1 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-center text-xs"
                >
                  {cols} Col
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="e.g. repeat(3, minmax(0, 1fr))"
              value={styles.gridTemplateColumns || ''}
              onChange={(e) => onChange({ gridTemplateColumns: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* Gap for both Flex and Grid */}
      {(display === 'flex' || display === 'grid') && (
        <div>
          <label className="block text-[11px] font-medium text-zinc-400 mb-1">Gap</label>
          <input
            type="text"
            placeholder="e.g. 16px"
            value={styles.gap || ''}
            onChange={(e) => onChange({ gap: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-zinc-200 text-xs"
          />
        </div>
      )}
    </div>
  );
};
