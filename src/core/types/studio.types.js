/**
 * @typedef {'desktop' | 'laptop' | 'tablet' | 'mobile'} DeviceViewport
 *
 * @typedef {Object} ViewportConfig
 * @property {DeviceViewport} id
 * @property {string} name
 * @property {number} width
 * @property {number} height
 *
 * @typedef {'components' | 'layers' | 'templates'} SidebarTab
 * @typedef {'layout' | 'spacing' | 'typography' | 'appearance'} InspectorTab
 *
 * @typedef {Object} StudioState
 * @property {import('./element.types').LayoutNode} rootNode
 * @property {string | null} selectedNodeId
 * @property {string | null} hoveredNodeId
 * @property {DeviceViewport} viewport
 * @property {number} zoom
 * @property {boolean} showGridOverlay
 * @property {boolean} isPreviewMode
 * @property {SidebarTab} activeSidebarTab
 * @property {InspectorTab} activeInspectorTab
 * @property {boolean} isExportModalOpen
 * @property {import('./element.types').LayoutNode[]} history
 * @property {number} historyIndex
 */

export const DEVICE_VIEWPORTS = ['desktop', 'laptop', 'tablet', 'mobile'];
