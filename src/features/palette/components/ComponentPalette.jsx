import { useState } from 'react';
import { Box, Columns2, Grid2x2, LayoutGrid, Heading, Pilcrow, MousePointerClick, Tag, TextCursorInput, Search } from 'lucide-react';
import { PALETTE_ITEMS } from '../constants/palette_items';

const ICON_MAP = {
  Box,
  Columns2,
  Grid2x2,
  LayoutGrid,
  Heading,
  Pilcrow,
  MousePointerClick,
  Tag,
  TextCursorInput,
};

export const ComponentPalette = ({ onInsertNode }) => {
  const [filter, setFilter] = useState('');

  const filteredItems = PALETTE_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  const categories = ['layout', 'typography', 'ui'];

  return (
    <div className="flex flex-col h-full overflow-hidden select-none">
      {/* Search Input */}
      <div className="p-3 border-b border-zinc-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Categorized Palette Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map((cat) => {
          const itemsInCat = filteredItems.filter((i) => i.category === cat);
          if (itemsInCat.length === 0) return null;

          return (
            <div key={cat}>
              <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                {cat}
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {itemsInCat.map((item) => {
                  const Icon = ICON_MAP[item.icon] || Box;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onInsertNode(item)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-800/80 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all group text-center"
                    >
                      <Icon className="w-5 h-5 mb-1.5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                      <span className="text-[11px] font-medium leading-tight">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
