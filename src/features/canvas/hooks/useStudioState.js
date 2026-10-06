import { useState, useCallback } from 'react';
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
  const [rootNode, setRootNode] = useState(DEFAULT_LAYOUT);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [viewport, setViewport] = useState('desktop');
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('components');
  const [inspectorTab, setInspectorTab] = useState('layout');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [clipboardNode, setClipboardNode] = useState(null);
  const { toasts, showToast } = useToast();

  // History stack for Undo / Redo
  const [history, setHistory] = useState([DEFAULT_LAYOUT]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushState = useCallback((newRoot) => {
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

  const handleSelectNode = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const handleInsertNode = useCallback((item) => {
    const newNode = item.createNode();
    const targetParentId = selectedId || rootNode.id;
    const targetParent = findNodeById(rootNode, targetParentId);

    const isContainer = targetParent?.children !== undefined;
    const parentIdToUse = isContainer ? targetParentId : (findParentNode(rootNode, targetParentId)?.id || rootNode.id);

    const updated = insertChildNode(rootNode, parentIdToUse, newNode);
    pushState(updated);
    setSelectedId(newNode.id);
  }, [selectedId, rootNode, pushState]);

  const handleUpdateStyles = useCallback((patch) => {
    if (!selectedId) return;
    const updated = updateNodeById(rootNode, selectedId, (node) => ({
      ...node,
      styles: { ...node.styles, ...patch },
    }));
    pushState(updated);
  }, [selectedId, rootNode, pushState]);

  const handleUpdateContent = useCallback((id, text) => {
    const updated = updateNodeById(rootNode, id, (node) => ({
      ...node,
      content: text,
    }));
    pushState(updated);
  }, [rootNode, pushState]);

  const handleUpdateName = useCallback((name) => {
    if (!selectedId) return;
    const updated = updateNodeById(rootNode, selectedId, (node) => ({
      ...node,
      name,
    }));
    pushState(updated);
  }, [selectedId, rootNode, pushState]);

  const handleDeleteNode = useCallback((id) => {
    if (id === rootNode.id) return;
    const updated = removeNodeById(rootNode, id);
    pushState(updated);
    if (selectedId === id) setSelectedId(null);
  }, [rootNode, selectedId, pushState]);

  const handleDuplicateNode = useCallback((id) => {
    const updated = duplicateNodeById(rootNode, id);
    pushState(updated);
  }, [rootNode, pushState]);

  const handleCopyNode = useCallback((id) => {
    if (id === rootNode.id) return;
    const node = findNodeById(rootNode, id);
    if (node) {
      setClipboardNode(node);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(JSON.stringify(node)).catch(() => {});
      }
    }
  }, [rootNode]);

  const handleCutNode = useCallback((id) => {
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
    (nodeToPaste, inPlace) => {
      const sourceNode = nodeToPaste || clipboardNode;
      if (!sourceNode) return;
      if (nodeToPaste && nodeToPaste !== clipboardNode) {
        setClipboardNode(nodeToPaste);
      }
      const cloned = cloneNodeWithNewIds(sourceNode);
      const targetParentId = selectedId || rootNode.id;
      const targetParent = findNodeById(rootNode, targetParentId);
      const isContainer = targetParent?.children !== undefined;
      let parentIdToUse;
      let insertIndex;

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
    (text) => {
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

      const textNode = {
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
      let parentIdToUse;
      let insertIndex;

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
    (dataUrl, options) => {
      const isScreenshot = options?.isScreenshot ?? false;
      const imgNode = {
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
      let parentIdToUse;
      let insertIndex;

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
    },
    [selectedId, rootNode, pushState]
  );

  const handleMoveOrder = useCallback((id, direction) => {
    const parent = findParentNode(rootNode, id);
    if (!parent || !parent.children) return;
    const idx = parent.children.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= parent.children.length) return;
    const updated = reorderChildNodes(rootNode, parent.id, idx, targetIdx);
    pushState(updated);
  }, [rootNode, pushState]);

  const handleToggleVisibility = useCallback((id) => {
    const updated = updateNodeById(rootNode, id, (node) => ({
      ...node,
      isHidden: !node.isHidden,
    }));
    pushState(updated);
  }, [rootNode, pushState]);

  const handleSelectTemplate = useCallback((template) => {
    pushState(template.root);
    setSelectedId(null);
  }, [pushState]);

  const handleImportLayout = useCallback((imported) => {
    pushState(imported);
    setSelectedId(null);
  }, [pushState]);

  const handleClearCanvas = useCallback(() => {
    const emptyCanvas = {
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
