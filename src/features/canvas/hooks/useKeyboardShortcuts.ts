import { useEffect, useRef } from 'react';
import type { LayoutNode } from '@/core/types/element.types';
import type { ToastMessage } from '@/core/types/shortcut.types';
import { findNodeById } from '@/core/utils/tree_operations';
import {
  extractImageDetailsFromClipboard,
  extractImageDetailsFromSystemClipboard,
  extractNodeFromClipboard,
  extractTextFromClipboard,
  extractNodeFromSystemClipboard,
  extractTextFromSystemClipboard,
  hasImageInClipboardData,
  isImageUrl,
  type ExtractedImageInfo,
} from '../utils/clipboard_helpers';

interface UseKeyboardShortcutsParams {
  rootNode: LayoutNode;
  selectedId: string | null;
  clipboardNode: LayoutNode | null;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: (id: string) => void;
  onCut: (id: string) => void;
  onPasteNode: (node?: LayoutNode, inPlace?: boolean) => void;
  onPasteImage: (
    dataUrl: string,
    options?: { name?: string; alt?: string; isScreenshot?: boolean }
  ) => void;
  onPasteText?: (text: string) => void;
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
  onPasteText,
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
  const pasteHandledRef = useRef<boolean>(false);
  const lastShiftRef = useRef<boolean>(false);
  const catcherRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let catcher = document.getElementById('layoutcraft-paste-catcher') as HTMLTextAreaElement | null;
    if (!catcher) {
      catcher = document.createElement('textarea');
      catcher.id = 'layoutcraft-paste-catcher';
      catcher.tabIndex = -1;
      catcher.setAttribute('aria-hidden', 'true');
      catcher.setAttribute('autocomplete', 'off');
      catcher.style.cssText =
        'position:fixed;left:0;top:0;width:1px;height:1px;padding:0;margin:0;border:none;outline:none;opacity:0.001;z-index:-9999;resize:none;overflow:hidden;background:transparent;';
      document.body.appendChild(catcher);
    }
    catcherRef.current = catcher;

    const handlePasteAction = async (
      dataTransfer?: DataTransfer | null,
      isShiftPressed: boolean = false,
      catcherValue?: string
    ) => {
      const now = Date.now();
      if (now - lastPasteTimeRef.current < 150) return;
      lastPasteTimeRef.current = now;

      // ─────────────────────────────────────────────────────────────
      // BRANCH A: Ctrl + Shift + V -> Dedicated Screenshot Pasting ("paste gambar hasil ssan")
      // ─────────────────────────────────────────────────────────────
      if (isShiftPressed) {
        // 1. Try extracting from provided event dataTransfer
        if (dataTransfer) {
          const imgDetails = await extractImageDetailsFromClipboard(dataTransfer);
          if (imgDetails?.dataUrl) {
            onPasteImage(imgDetails.dataUrl, {
              name: 'Screenshot Image',
              alt: 'Pasted Screenshot',
              isScreenshot: true,
            });
            showToast('Screenshot pasted to canvas', 'success');
            return;
          }
        }

        // 2. Try parsing fallback data:image from textarea catcher
        if (catcherValue && catcherValue.trim().startsWith('data:image/')) {
          onPasteImage(catcherValue.trim(), {
            name: 'Screenshot Image',
            alt: 'Pasted Screenshot',
            isScreenshot: true,
          });
          showToast('Screenshot pasted to canvas', 'success');
          return;
        }

        // 3. Query system clipboard for screenshot
        const systemImg = await extractImageDetailsFromSystemClipboard(200);
        if (systemImg?.dataUrl) {
          onPasteImage(systemImg.dataUrl, {
            name: 'Screenshot Image',
            alt: 'Pasted Screenshot',
            isScreenshot: true,
          });
          showToast('Screenshot pasted to canvas', 'success');
          return;
        }

        showToast('No screenshot found in clipboard (take screenshot with Win+Shift+S first)', 'warning');
        return;
      }

      // ─────────────────────────────────────────────────────────────
      // BRANCH B: Ctrl + V -> Copy & Paste Element / Copied Image ("coppy n paste gambar / elemen")
      // ─────────────────────────────────────────────────────────────
      const notifyNodePasted = (node: LayoutNode) => {
        const isImage = node.tag === 'img';
        showToast(isImage ? 'Image pasted to canvas' : 'Component pasted to canvas', 'success');
      };

      // 1. In-memory copied node takes highest priority for copy-paste
      if (clipboardNode) {
        onPasteNode(clipboardNode, false);
        notifyNodePasted(clipboardNode);
        return;
      }

      // 2. Try extracting LayoutNode JSON from dataTransfer text/plain
      if (dataTransfer) {
        const parsedNode = extractNodeFromClipboard(dataTransfer);
        if (parsedNode) {
          onPasteNode(parsedNode, false);
          notifyNodePasted(parsedNode);
          return;
        }
      }

      // 3. Try parsing LayoutNode JSON from textarea catcher fallback
      if (catcherValue && catcherValue.trim()) {
        const trimmed = catcherValue.trim();
        if (trimmed.startsWith('{')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (parsed && typeof parsed === 'object' && parsed.id && parsed.tag && parsed.styles) {
              onPasteNode(parsed, false);
              notifyNodePasted(parsed);
              return;
            }
          } catch {
            // Ignore parse error
          }
        }
      }

      // 4. Try querying system clipboard for LayoutNode JSON
      const systemNode = await extractNodeFromSystemClipboard(150);
      if (systemNode) {
        onPasteNode(systemNode, false);
        notifyNodePasted(systemNode);
        return;
      }

      // 5. Extract image details from dataTransfer or system clipboard
      let imageDetails: ExtractedImageInfo | null = null;
      if (dataTransfer) {
        imageDetails = await extractImageDetailsFromClipboard(dataTransfer);
      }
      if (!imageDetails && catcherValue && catcherValue.trim()) {
        const trimmed = catcherValue.trim();
        if (trimmed.startsWith('data:image/') || isImageUrl(trimmed)) {
          imageDetails = {
            dataUrl: trimmed,
            isCopiedImage: true,
            isScreenshot: false,
            name: 'Image',
            alt: 'Copied Image',
          };
        }
      }
      if (!imageDetails) {
        imageDetails = await extractImageDetailsFromSystemClipboard(150);
      }

      // 6. If user copied an image (web / Pinterest / file / URL / data URI), paste it!
      if (imageDetails && imageDetails.isCopiedImage) {
        onPasteImage(imageDetails.dataUrl, {
          name: imageDetails.name || 'Image',
          alt: imageDetails.alt || 'Copied Image',
          isScreenshot: false,
        });
        showToast('Image pasted to canvas', 'success');
        return;
      }

      // 7. Try plain text insertion
      let textToPaste: string | null = null;
      if (dataTransfer) {
        textToPaste = extractTextFromClipboard(dataTransfer);
      }
      if (!textToPaste && catcherValue && catcherValue.trim() && !catcherValue.trim().startsWith('{')) {
        textToPaste = catcherValue.trim();
      }
      if (!textToPaste) {
        textToPaste = await extractTextFromSystemClipboard(150);
      }

      if (textToPaste && !textToPaste.startsWith('data:image/') && !isImageUrl(textToPaste)) {
        if (onPasteText) {
          onPasteText(textToPaste);
          showToast('Text pasted to canvas', 'success');
          return;
        }
      }

      // 8. If clipboard holds a SCREENSHOT (not a copied image)
      // Per specification: Ctrl+V pastes copied images; screenshots require Ctrl+Shift+V
      if (imageDetails && imageDetails.isScreenshot) {
        showToast('Screenshot detected. Press Ctrl+Shift+V to paste screenshot', 'info');
        return;
      }

      showToast('Clipboard is empty. Copy an image or element first (Ctrl+C)', 'warning');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target instanceof HTMLInputElement ||
        (target instanceof HTMLTextAreaElement && target !== catcherRef.current);

      if (isInput) {
        return;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const isSelected = Boolean(selectedId && selectedId !== rootNode.id);
      const isPasteKey = e.key === 'v' || e.key === 'V' || e.code === 'KeyV';

      // Unified handling for Ctrl+V and Ctrl+Shift+V
      if (isCtrlOrMeta && isPasteKey) {
        // If inside an active contentEditable text span on the canvas
        if (target?.isContentEditable && target !== catcherRef.current) {
          return;
        }

        lastShiftRef.current = e.shiftKey;
        pasteHandledRef.current = false;
        const previousActive = document.activeElement as HTMLElement | null;

        // Focus and select catcher so browser native paste event lands on it
        if (catcherRef.current) {
          catcherRef.current.value = '';
          catcherRef.current.focus({ preventScroll: true });
          catcherRef.current.select();
        }

        // Fallback timer: if browser does not emit native paste event within 35ms
        setTimeout(async () => {
          if (!pasteHandledRef.current) {
            pasteHandledRef.current = true;
            await handlePasteAction(null, lastShiftRef.current, catcherRef.current?.value);
            if (previousActive && typeof previousActive.focus === 'function' && previousActive !== catcherRef.current) {
              previousActive.focus({ preventScroll: true });
            } else {
              const artboard = document.querySelector<HTMLElement>('[tabindex="0"]');
              artboard?.focus({ preventScroll: true });
            }
          }
        }, 35);
        return;
      }

      if (target?.isContentEditable) {
        if (isCtrlOrMeta && (e.key === 'c' || e.key === 'C')) {
          const hasSelection = Boolean(window.getSelection()?.toString().trim());
          if (hasSelection) return;
        }
        if (!isCtrlOrMeta && e.key !== 'Escape') {
          return;
        }
      }

      const selectedNode = selectedId ? findNodeById(rootNode, selectedId) : null;
      const isImageSelected = selectedNode?.tag === 'img';

      if (isCtrlOrMeta && (e.key === 'c' || e.key === 'C') && isSelected) {
        e.preventDefault();
        onCopy(selectedId!);
        showToast(isImageSelected ? 'Image copied to clipboard' : 'Element copied to clipboard', 'default');
      } else if (isCtrlOrMeta && (e.key === 'x' || e.key === 'X') && isSelected) {
        e.preventDefault();
        onCut(selectedId!);
        showToast(isImageSelected ? 'Image cut to clipboard' : 'Element cut to clipboard', 'default');
      } else if (isCtrlOrMeta && (e.key === 'd' || e.key === 'D') && isSelected) {
        e.preventDefault();
        onDuplicate(selectedId!);
        showToast(isImageSelected ? 'Image duplicated' : 'Element duplicated', 'default');
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
      const isInput =
        target instanceof HTMLInputElement ||
        (target instanceof HTMLTextAreaElement && target !== catcherRef.current);

      const clipboardData = e.clipboardData;
      const hasImage = hasImageInClipboardData(clipboardData);

      // In real inputs, allow native paste if plain text and no image
      if (isInput && !hasImage) {
        return;
      }

      // In contentEditable text spans (inline text editing on canvas, not our catcher)
      if (target?.isContentEditable && target !== catcherRef.current && !hasImage) {
        const text = clipboardData?.getData('text/plain');
        if (text) {
          if (text.trim().startsWith('{')) {
            const parsed = extractNodeFromClipboard(clipboardData);
            if (parsed) {
              e.preventDefault();
              e.stopPropagation();
              pasteHandledRef.current = true;
              onPasteNode(parsed, false);
              const isImage = parsed.tag === 'img';
              showToast(isImage ? 'Image pasted to canvas' : 'Component pasted to canvas', 'success');
              return;
            }
          }
          // Clean plain text paste into contentEditable span
          e.preventDefault();
          e.stopPropagation();
          pasteHandledRef.current = true;
          document.execCommand('insertText', false, text);
          showToast('Plain text pasted', 'default');
          return;
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      pasteHandledRef.current = true;
      handlePasteAction(clipboardData, lastShiftRef.current, catcherRef.current?.value);

      // Refocus canvas artboard if focus was routed to capture element
      if (document.activeElement === catcherRef.current) {
        const artboard = document.querySelector<HTMLElement>('[tabindex="0"]');
        if (artboard && typeof artboard.focus === 'function') {
          artboard.focus({ preventScroll: true });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('paste', handlePasteEvent, true);
    document.addEventListener('paste', handlePasteEvent, true);
    catcher?.addEventListener('paste', handlePasteEvent, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('paste', handlePasteEvent, true);
      document.removeEventListener('paste', handlePasteEvent, true);
      catcher?.removeEventListener('paste', handlePasteEvent, true);
      if (catcher && catcher.parentNode) {
        catcher.parentNode.removeChild(catcher);
      }
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
    onPasteText,
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
