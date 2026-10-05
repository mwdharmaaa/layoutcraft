import type { FC } from 'react';
import { Sliders, Maximize2, Type, Palette } from 'lucide-react';
import type { LayoutNode, ElementStyles } from '@/core/types/element.types';
import type { InspectorTab } from '@/core/types/studio.types';
import { LayoutSection } from './LayoutSection';
import { SpacingSection } from './SpacingSection';
import { TypographySection } from './TypographySection';
import { AppearanceSection } from './AppearanceSection';

interface PropertyInspectorProps {
  selectedNode: LayoutNode | null;
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  onUpdateStyles: (styles: Partial<ElementStyles>) => void;
  onUpdateContent: (content: string) => void;
  onUpdateName: (name: string) => void;
}

export const PropertyInspector: FC<PropertyInspectorProps> = ({
  selectedNode,
  activeTab,
  onTabChange,
  onUpdateStyles,
  onUpdateContent,
  onUpdateName,
}) => {
  if (!selectedNode) {
    return (
      <div className="w-72 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col items-center justify-center text-center select-none">
        <Sliders className="w-8 h-8 text-zinc-600 mb-3" />
        <h4 className="text-zinc-300 font-medium text-xs mb-1">No Element Selected</h4>
        <p className="text-zinc-500 text-[11px] leading-relaxed">
          Click any container or component on the canvas to configure its layout, dimensions, and visual styling.
        </p>
      </div>
    );
  }

  const tabs: { id: InspectorTab; label: string; icon: FC<{ className?: string }> }[] = [
    { id: 'layout', label: 'Layout', icon: Sliders },
    { id: 'spacing', label: 'Box', icon: Maximize2 },
    { id: 'typography', label: 'Type', icon: Type },
    { id: 'appearance', label: 'Style', icon: Palette },
  ];

  return (
    <aside className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full overflow-hidden select-none">
      {/* Header with Element Identity */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-950/40">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-mono text-[10px] uppercase font-bold">
            {selectedNode.tag}
          </span>
          <input
            type="text"
            value={selectedNode.name}
            onChange={(e) => onUpdateName(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold text-zinc-200 border-b border-transparent hover:border-zinc-700 focus:border-blue-500 focus:outline-none px-1"
          />
        </div>

        {/* Content Field if present */}
        {selectedNode.content !== undefined && (
          <div>
            <label className="block text-[10px] text-zinc-500 mb-0.5">Text Content</label>
            <textarea
              rows={2}
              value={selectedNode.content}
              onChange={(e) => onUpdateContent(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 resize-none focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-2 flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-800/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'layout' && (
          <LayoutSection styles={selectedNode.styles} onChange={onUpdateStyles} />
        )}
        {activeTab === 'spacing' && (
          <SpacingSection styles={selectedNode.styles} onChange={onUpdateStyles} />
        )}
        {activeTab === 'typography' && (
          <TypographySection styles={selectedNode.styles} onChange={onUpdateStyles} />
        )}
        {activeTab === 'appearance' && (
          <AppearanceSection styles={selectedNode.styles} onChange={onUpdateStyles} />
        )}
      </div>
    </aside>
  );
};
