import { useState, useCallback, useEffect } from 'react';
import type { LayoutNode, ElementStyles } from '@/core/types/element.types';
import type { DeviceViewport, SidebarTab, InspectorTab } from '@/core/types/studio.types';
import type { PaletteItem } from '@/features/palette/constants/palette_items';
import type { TemplateDefinition } from '@/features/templates/constants/templates_data';
import { DEFAULT_LAYOUT } from '@/core/constants/default_layout';
import {
  findNodeById,
  updateNodeById,
  insertChildNode,
  removeNodeById,
  duplicateNodeById,
  findParentNode,
  reorderChildNodes,
} from '@/core/utils/tree_operations';

export function useStudioState() {
  const [rootNode, setRootNode] = useState<LayoutNode>(DEFAULT_LAYOUT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('components');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('layout');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // History stack for Undo / Redo
  const [history, setHistory] = useState<LayoutNode[]>([DEFAULT_LAYOUT]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushState = useCallback((newRoot: LayoutNode) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newRoot];
    });
    setHistoryIndex((prev) => prev + 1);
    setRootNode(newRoot);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setRootNode(history[nextIndex]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setRootNode(history[nextIndex]);
    }
  }, [historyIndex, history]);

  const handleSelectNode = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleInsertNode = useCallback((item: PaletteItem) => {
    const newNode = item.createNode();
    const targetParentId = selectedId || rootNode.id;
    const targetParent = findNodeById(rootNode, targetParentId);

    const isContainer = targetParent?.children !== undefined;
    const parentIdToUse = isContainer ? targetParentId : (findParentNode(rootNode, targetParentId)?.id || rootNode.id);

    const updated = insertChildNode(rootNode, parentIdToUse, newNode);
    pushState(updated);
    setSelectedId(newNode.id);
  }, [selectedId, rootNode, pushState]);

  const handleUpdateStyles = useCallback((patch: Partial<ElementStyles>) => {
    if (!selectedId) return;
    const updated = updateNodeById(rootNode, selectedId, (node) => ({
      ...node,
      styles: { ...node.styles, ...patch },
    }));
    pushState(updated);
  }, [selectedId, rootNode, pushState]);

  const handleUpdateContent = useCallback((id: string, text: string) => {
    const updated = updateNodeById(rootNode, id, (node) => ({
      ...node,
      content: text,
    }));
    pushState(updated);
  }, [rootNode, pushState]);

  const handleUpdateName = useCallback((name: string) => {
    if (!selectedId) return;
    const updated = updateNodeById(rootNode, selectedId, (node) => ({
      ...node,
      name,
    }));
    pushState(updated);
  }, [selectedId, rootNode, pushState]);

  const handleDeleteNode = useCallback((id: string) => {
    if (id === rootNode.id) return;
    const updated = removeNodeById(rootNode, id);
    pushState(updated);
    if (selectedId === id) setSelectedId(null);
  }, [rootNode, selectedId, pushState]);

  const handleDuplicateNode = useCallback((id: string) => {
    const updated = duplicateNodeById(rootNode, id);
    pushState(updated);
  }, [rootNode, pushState]);

  const handleMoveOrder = useCallback((id: string, direction: 'up' | 'down') => {
    const parent = findParentNode(rootNode, id);
    if (!parent || !parent.children) return;
    const idx = parent.children.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= parent.children.length) return;
    const updated = reorderChildNodes(rootNode, parent.id, idx, targetIdx);
    pushState(updated);
  }, [rootNode, pushState]);

  const handleToggleVisibility = useCallback((id: string) => {
    const updated = updateNodeById(rootNode, id, (node) => ({
      ...node,
      isHidden: !node.isHidden,
    }));
    pushState(updated);
  }, [rootNode, pushState]);

  const handleSelectTemplate = useCallback((template: TemplateDefinition) => {
    pushState(template.root);
    setSelectedId(null);
  }, [pushState]);

  const handleImportLayout = useCallback((imported: LayoutNode) => {
    pushState(imported);
    setSelectedId(null);
  }, [pushState]);

  const handleClearCanvas = useCallback(() => {
    const emptyCanvas: LayoutNode = {
      ...DEFAULT_LAYOUT,
      id: 'root-canvas',
      name: 'Canvas Page',
      children: [],
    };
    pushState(emptyCanvas);
    setSelectedId(null);
  }, [pushState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedId) {
        e.preventDefault();
        handleDuplicateNode(selectedId);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && selectedId !== rootNode.id) {
        e.preventDefault();
        handleDeleteNode(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleDuplicateNode, handleDeleteNode, selectedId, rootNode.id]);

  const selectedNode = selectedId ? findNodeById(rootNode, selectedId) : null;

  return {
    rootNode,
    selectedId,
    selectedNode,
    hoveredId,
    viewport,
    zoom,
    showGrid,
    isPreview,
    sidebarTab,
    inspectorTab,
    isExportOpen,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setHoveredId,
    setViewport,
    setZoom,
    setShowGrid: () => setShowGrid((p) => !p),
    setIsPreview: () => setIsPreview((p) => !p),
    setSidebarTab,
    setInspectorTab,
    setIsExportOpen,
    handleUndo,
    handleRedo,
    handleSelectNode,
    handleInsertNode,
    handleUpdateStyles,
    handleUpdateContent,
    handleUpdateName,
    handleDeleteNode,
    handleDuplicateNode,
    handleMoveOrder,
    handleToggleVisibility,
    handleSelectTemplate,
    handleImportLayout,
    handleClearCanvas,
  };
}
