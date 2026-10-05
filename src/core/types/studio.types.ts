import type { LayoutNode } from './element.types';

export type DeviceViewport = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export interface ViewportConfig {
  id: DeviceViewport;
  name: string;
  width: number;
  height: number;
}

export type SidebarTab = 'components' | 'layers' | 'templates';
export type InspectorTab = 'layout' | 'spacing' | 'typography' | 'appearance';

export interface StudioState {
  rootNode: LayoutNode;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  viewport: DeviceViewport;
  zoom: number;
  showGridOverlay: boolean;
  isPreviewMode: boolean;
  activeSidebarTab: SidebarTab;
  activeInspectorTab: InspectorTab;
  isExportModalOpen: boolean;
  history: LayoutNode[];
  historyIndex: number;
}
