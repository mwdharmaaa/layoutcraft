import { useEffect, useRef } from 'react';
import type { LayoutNode } from '@/core/types/element.types';
import type { ToastMessage } from '@/core/types/shortcut.types';
import {
  extractImageFromClipboard,
  extractImageFromSystemClipboard,
} from '../utils/clipboard_helpers';

interface UseKeyboardShortcutsParams {
  rootNode: LayoutNode;
  selectedId: string | null;
  clipboardNode: LayoutNode | null;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: (id: string) => void;
  onCut: (id: string) => void;
  onPasteNode: () => void;
  onPasteImage: (dataUrl: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveOrder: (id: string, dir: 'up' | 'down') => void;
  onToggleVisibility: (id: string) => void;
  onSetZoom: (updater: (prev: number) => number) => void;
  onToggleGrid: () => void;
  onTogglePreview: () => void;
  onOpenExport: () => void;
  onToggleShortcutsModal: () => void;
  onDeselect: () => void;
  showToast: (msg: string, type?: ToastMessage['type']) => void;
}

export function useKeyboardShortcuts({
  rootNode,
  selectedId,
  clipboardNode,
  onUndo,
  onRedo,
  onCopy,
  onCut,
  onPasteNode,
  onPasteImage,
  onDuplicate,
  onDelete,
  onMoveOrder,
  onToggleVisibility,
  onSetZoom,
  onToggleGrid,
  onTogglePreview,
  onOpenExport,
  onToggleShortcutsModal,
  onDeselect,
  showToast,
}: UseKeyboardShortcutsParams) {
  const lastPasteTimeRef = useRef<number>(0);

  useEffect(() => {
    const handlePasteAction = async (dataTransfer?: DataTransfer | null) => {
      const now = Date.now();
      if (now - lastPasteTimeRef.current < 400) return;
      lastPasteTimeRef.current = now;

      // 1. Try extracting image from provided event dataTransfer
      if (dataTransfer) {
        const imgData = await extractImageFromClipboard(dataTransfer);
        if (imgData) {
          onPasteImage(imgData);
          showToast('Screenshot pasted to canvas', 'success');
          return;
        }
      }

      // 2. Try async reading image from system navigator.clipboard
      const systemImg = await extractImageFromSystemClipboard();
      if (systemImg) {
        onPasteImage(systemImg);
        showToast('Screenshot pasted to canvas', 'success');
        return;
      }

      // 3. Fallback to in-memory copied node
      if (clipboardNode) {
        onPasteNode();
        showToast('Component pasted to canvas', 'success');
        return;
      }

      showToast('Clipboard is empty or unsupported format', 'warning');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const isSelected = Boolean(selectedId && selectedId !== rootNode.id);

      if (isCtrlOrMeta && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        handlePasteAction(null);
      } else if (isCtrlOrMeta && (e.key === 'c' || e.key === 'C') && isSelected) {
        e.preventDefault();
        onCopy(selectedId!);
        showToast('Element copied to clipboard', 'default');
      } else if (isCtrlOrMeta && (e.key === 'x' || e.key === 'X') && isSelected) {
        e.preventDefault();
        onCut(selectedId!);
        showToast('Element cut to clipboard', 'default');
      } else if (isCtrlOrMeta && (e.key === 'd' || e.key === 'D') && isSelected) {
        e.preventDefault();
        onDuplicate(selectedId!);
        showToast('Element duplicated', 'default');
      } else if (isCtrlOrMeta && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo();
          showToast('Redo', 'info');
        } else {
          onUndo();
          showToast('Undo', 'info');
        }
      } else if (isCtrlOrMeta && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        onRedo();
        showToast('Redo', 'info');
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && isSelected) {
        e.preventDefault();
        onDelete(selectedId!);
        showToast('Element deleted', 'warning');
      } else if (e.altKey && e.key === 'ArrowUp' && isSelected) {
        e.preventDefault();
        onMoveOrder(selectedId!, 'up');
        showToast('Reordered element up', 'default');
      } else if (e.altKey && e.key === 'ArrowDown' && isSelected) {
        e.preventDefault();
        onMoveOrder(selectedId!, 'down');
        showToast('Reordered element down', 'default');
      } else if (isCtrlOrMeta && (e.key === 'h' || e.key === 'H') && isSelected) {
        e.preventDefault();
        onToggleVisibility(selectedId!);
        showToast('Toggled element visibility', 'default');
      } else if (isCtrlOrMeta && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        onSetZoom((z) => Math.min(150, z + 10));
      } else if (isCtrlOrMeta && e.key === '-') {
        e.preventDefault();
        onSetZoom((z) => Math.max(50, z - 10));
      } else if (isCtrlOrMeta && e.key === '0') {
        e.preventDefault();
        onSetZoom(() => 100);
        showToast('Zoom reset to 100%', 'default');
      } else if (isCtrlOrMeta && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        onToggleGrid();
        showToast('Canvas grid toggled', 'default');
      } else if (isCtrlOrMeta && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        onTogglePreview();
      } else if (isCtrlOrMeta && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        onOpenExport();
      } else if (isCtrlOrMeta && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        showToast('Layout state saved to session', 'success');
      } else if (e.key === '?' || (isCtrlOrMeta && e.key === '/')) {
        e.preventDefault();
        onToggleShortcutsModal();
      } else if (e.key === 'Escape') {
        onDeselect();
      }
    };

    const handlePasteEvent = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      handlePasteAction(e.clipboardData);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePasteEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePasteEvent);
    };
  }, [
    rootNode,
    selectedId,
    clipboardNode,
    onUndo,
    onRedo,
    onCopy,
    onCut,
    onPasteNode,
    onPasteImage,
    onDuplicate,
    onDelete,
    onMoveOrder,
    onToggleVisibility,
    onSetZoom,
    onToggleGrid,
    onTogglePreview,
    onOpenExport,
    onToggleShortcutsModal,
    onDeselect,
    showToast,
  ]);
}
