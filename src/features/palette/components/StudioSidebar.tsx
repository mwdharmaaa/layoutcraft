import React from 'react';
import { PlusSquare, Layers, LayoutTemplate } from 'lucide-react';
import type { LayoutNode } from '@/core/types/element.types';
import type { SidebarTab } from '@/core/types/studio.types';
import type { PaletteItem } from '../constants/palette_items';
import type { TemplateDefinition } from '@/features/templates/constants/templates_data';
import { ComponentPalette } from './ComponentPalette';
import { LayersTree } from '@/features/layers/components/LayersTree';
import { TemplatePicker } from '@/features/templates/components/TemplatePicker';

interface StudioSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onInsertNode: (item: PaletteItem) => void;
  rootNode: LayoutNode;
  selectedId: string | null;
  onSelectNode: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onSelectTemplate: (template: TemplateDefinition) => void;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeTab,
  onTabChange,
  onInsertNode,
  rootNode,
  selectedId,
  onSelectNode,
  onToggleVisibility,
  onDeleteNode,
  onSelectTemplate,
}) => {
  const tabs = [
    { id: 'components' as SidebarTab, label: 'Blocks', icon: PlusSquare },
    { id: 'layers' as SidebarTab, label: 'Layers', icon: Layers },
    { id: 'templates' as SidebarTab, label: 'Presets', icon: LayoutTemplate },
  ];

  return (
    <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full overflow-hidden select-none">
      {/* Top Tab Switcher */}
      <div className="flex border-b border-zinc-800 bg-zinc-950/40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-zinc-800/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'components' && <ComponentPalette onInsertNode={onInsertNode} />}
        {activeTab === 'layers' && (
          <LayersTree
            node={rootNode}
            selectedId={selectedId}
            onSelect={onSelectNode}
            onToggleVisibility={onToggleVisibility}
            onDelete={onDeleteNode}
          />
        )}
        {activeTab === 'templates' && (
          <TemplatePicker onSelectTemplate={onSelectTemplate} />
        )}
      </div>
    </aside>
  );
};
