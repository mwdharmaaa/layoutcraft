import { useState, useCallback } from 'react';
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
  cloneNodeWithNewIds,
} from '@/core/utils/tree_operations';
import { generateElementId } from '@/core/utils/id_generator';
import { useToast } from '@/features/toast/hooks/useToast';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

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
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [clipboardNode, setClipboardNode] = useState<LayoutNode | null>(null);
  const { toasts, showToast } = useToast();

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

  const handleCopyNode = useCallback((id: string) => {
    if (id === rootNode.id) return;
    const node = findNodeById(rootNode, id);
    if (node) {
      setClipboardNode(node);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(JSON.stringify(node)).catch(() => {});
      }
    }
  }, [rootNode]);

  const handleCutNode = useCallback((id: string) => {
    if (id === rootNode.id) return;
    const node = findNodeById(rootNode, id);
    if (node) {
      setClipboardNode(node);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(JSON.stringify(node)).catch(() => {});
      }
      const updated = removeNodeById(rootNode, id);
      pushState(updated);
      setSelectedId(null);
    }
  }, [rootNode, pushState]);

  const handlePasteNode = useCallback(
    (nodeToPaste?: LayoutNode, inPlace?: boolean) => {
      const sourceNode = nodeToPaste || clipboardNode;
      if (!sourceNode) return;
      if (nodeToPaste && nodeToPaste !== clipboardNode) {
        setClipboardNode(nodeToPaste);
      }
      const cloned = cloneNodeWithNewIds(sourceNode);
      const targetParentId = selectedId || rootNode.id;
      const targetParent = findNodeById(rootNode, targetParentId);
      const isContainer = targetParent?.children !== undefined;
      let parentIdToUse: string;
      let insertIndex: number | undefined;

      if (inPlace && selectedId && selectedId !== rootNode.id) {
        const parent = findParentNode(rootNode, selectedId);
        parentIdToUse = parent?.id || rootNode.id;
        if (parent?.children) {
          const siblingIndex = parent.children.findIndex((c) => c.id === selectedId);
          insertIndex = siblingIndex !== -1 ? siblingIndex + 1 : undefined;
        }
      } else if (isContainer) {
        parentIdToUse = targetParentId;
        insertIndex = targetParent.children?.length;
      } else {
        const parent = findParentNode(rootNode, targetParentId);
        parentIdToUse = parent?.id || rootNode.id;
        if (parent?.children) {
          const siblingIndex = parent.children.findIndex((c) => c.id === targetParentId);
          insertIndex = siblingIndex !== -1 ? siblingIndex + 1 : undefined;
        }
      }

      const updated = insertChildNode(rootNode, parentIdToUse, cloned, insertIndex);
      pushState(updated);
      setSelectedId(cloned.id);
    },
    [clipboardNode, selectedId, rootNode, pushState]
  );

  const handlePasteText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const targetNode = selectedId ? findNodeById(rootNode, selectedId) : null;
      const isTextLeaf =
        targetNode &&
        (!targetNode.children || targetNode.children.length === 0) &&
        ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a', 'label'].includes(targetNode.tag);

      if (targetNode && isTextLeaf) {
        const updated = updateNodeById(rootNode, targetNode.id, (n) => ({
          ...n,
          content: trimmed,
        }));
        pushState(updated);
        return;
      }

      const textNode: LayoutNode = {
        id: generateElementId('p'),
        name: 'Text Block',
        tag: 'p',
        category: 'typography',
        content: trimmed,
        styles: {
          color: '#f4f4f5',
          fontSize: '16px',
          lineHeight: '1.6',
          marginTop: '8px',
          marginBottom: '8px',
        },
      };

      const targetParentId = selectedId || rootNode.id;
      const targetParent = findNodeById(rootNode, targetParentId);
      const isContainer = targetParent?.children !== undefined;
      let parentIdToUse: string;
      let insertIndex: number | undefined;

      if (isContainer) {
        parentIdToUse = targetParentId;
        insertIndex = targetParent.children?.length;
      } else {
        const parent = findParentNode(rootNode, targetParentId);
        parentIdToUse = parent?.id || rootNode.id;
        if (parent?.children) {
          const siblingIndex = parent.children.findIndex((c) => c.id === targetParentId);
          insertIndex = siblingIndex !== -1 ? siblingIndex + 1 : undefined;
        }
      }

      const updated = insertChildNode(rootNode, parentIdToUse, textNode, insertIndex);
      pushState(updated);
      setSelectedId(textNode.id);

      setTimeout(() => {
        const el = document.getElementById(`canvas-${textNode.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    },
    [selectedId, rootNode, pushState]
  );

  const handlePasteImage = useCallback(
    (
      dataUrl: string,
      options?: { name?: string; alt?: string; isScreenshot?: boolean }
    ) => {
      const isScreenshot = options?.isScreenshot ?? false;
      const imgNode: LayoutNode = {
        id: generateElementId('img'),
        name: options?.name ?? (isScreenshot ? 'Screenshot Image' : 'Image'),
        tag: 'img',
        category: 'media',
        attributes: {
          src: dataUrl,
          alt: options?.alt ?? (isScreenshot ? 'Pasted Screenshot' : 'Copied Image'),
        },
        styles: {
          width: '100%',
          maxWidth: '720px',
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          marginTop: '12px',
          marginBottom: '12px',
        },
      };

    const targetParentId = selectedId || rootNode.id;
    const targetParent = findNodeById(rootNode, targetParentId);
    const isContainer = targetParent?.children !== undefined;
    let parentIdToUse: string;
    let insertIndex: number | undefined;

    if (isContainer) {
      parentIdToUse = targetParentId;
      insertIndex = targetParent.children?.length;
    } else {
      const parent = findParentNode(rootNode, targetParentId);
      parentIdToUse = parent?.id || rootNode.id;
      if (parent?.children) {
        const siblingIndex = parent.children.findIndex((c) => c.id === targetParentId);
        insertIndex = siblingIndex !== -1 ? siblingIndex + 1 : undefined;
      }
    }

    const updated = insertChildNode(rootNode, parentIdToUse, imgNode, insertIndex);
    pushState(updated);
    setSelectedId(imgNode.id);

    setTimeout(() => {
      const el = document.getElementById(`canvas-${imgNode.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  }, [selectedId, rootNode, pushState]);

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

  // Keyboard and paste shortcuts integration
  useKeyboardShortcuts({
    rootNode,
    selectedId,
    clipboardNode,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onCopy: handleCopyNode,
    onCut: handleCutNode,
    onPasteNode: handlePasteNode,
    onPasteImage: handlePasteImage,
    onPasteText: handlePasteText,
    onDuplicate: handleDuplicateNode,
    onDelete: handleDeleteNode,
    onMoveOrder: handleMoveOrder,
    onToggleVisibility: handleToggleVisibility,
    onSetZoom: setZoom,
    onToggleGrid: () => setShowGrid((p) => !p),
    onTogglePreview: () => setIsPreview((p) => !p),
    onOpenExport: () => setIsExportOpen(true),
    onToggleShortcutsModal: () => setIsShortcutsOpen((p) => !p),
    onDeselect: () => {
      setSelectedId(null);
      setIsShortcutsOpen(false);
      setIsExportOpen(false);
    },
    showToast,
  });

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
    isShortcutsOpen,
    clipboardNode,
    toasts,
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
    setIsShortcutsOpen,
    handleUndo,
    handleRedo,
    handleSelectNode,
    handleInsertNode,
    handleUpdateStyles,
    handleUpdateContent,
    handleUpdateName,
    handleDeleteNode,
    handleDuplicateNode,
    handleCopyNode,
    handleCutNode,
    handlePasteNode,
    handlePasteImage,
    handleMoveOrder,
    handleToggleVisibility,
    handleSelectTemplate,
    handleImportLayout,
    handleClearCanvas,
  };
}
