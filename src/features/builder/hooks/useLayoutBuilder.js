import { useState, useCallback } from 'react';
import {
  DEFAULT_GRID_SIZE,
  BOX_PRESETS,
  INITIAL_BUILDER_BOXES,
  DEFAULT_RESIZABLE_SIDES,
} from '../constants/builder_defaults';
import { snapToGridValue } from '../utils/snap_helpers';

const normalizeBoxes = (rawBoxes, prefix = 'box') => {
  const source = rawBoxes !== undefined ? rawBoxes : INITIAL_BUILDER_BOXES;
  if (!Array.isArray(source)) return [];
  return source.map((box, idx) => ({
    ...box,
    id: box.id || `${prefix}-${Date.now()}-${idx + 1}-${Math.random().toString(36).slice(2, 6)}`,
    resizableSides: box.resizableSides ? { ...box.resizableSides } : { ...DEFAULT_RESIZABLE_SIDES },
  }));
};

export function useLayoutBuilder(initialBoxes) {
  const [boxes, setBoxes] = useState(() => normalizeBoxes(initialBoxes));
  const [selectedBoxId, setSelectedBoxId] = useState(() => {
    const list = normalizeBoxes(initialBoxes);
    return list[0]?.id || null;
  });
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // History stack
  const [history, setHistory] = useState(() => [normalizeBoxes(initialBoxes)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const commitToHistory = useCallback((newBoxes) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newBoxes];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setBoxes(history[nextIndex]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setBoxes(history[nextIndex]);
    }
  }, [historyIndex, history]);

  const handleAddBox = useCallback((preset = BOX_PRESETS[0], customCoords = null) => {
    const newId = `box-${Date.now()}`;
    let rawX;
    let rawY;

    if (customCoords && typeof customCoords.x === 'number' && typeof customCoords.y === 'number') {
      rawX = customCoords.x;
      rawY = customCoords.y;
    } else {
      const selected = boxes.find((b) => b.id === selectedBoxId);
      if (selected) {
        rawX = selected.x;
        rawY = selected.y + selected.height + 20;
      } else if (boxes.length > 0) {
        const lowest = boxes.reduce(
          (prev, curr) => (curr.y + curr.height > prev.y + prev.height ? curr : prev),
          boxes[0]
        );
        rawX = lowest.x;
        rawY = lowest.y + lowest.height + 20;
      } else {
        rawX = 40;
        rawY = 40;
      }
    }

    const newBox = {
      id: newId,
      name: `${preset.name} ${boxes.length + 1}`,
      x: snapToGrid ? snapToGridValue(rawX, gridSize) : Math.round(rawX),
      y: snapToGrid ? snapToGridValue(rawY, gridSize) : Math.round(rawY),
      width: preset.width || 360,
      height: preset.height || 240,
      color: preset.color || '#18181b',
      borderColor: preset.borderColor || '#27272a',
      textColor: preset.textColor || '#f4f4f5',
      borderRadius: 8,
      zIndex: boxes.length + 1,
      resizableSides: preset.resizableSides ? { ...preset.resizableSides } : { ...DEFAULT_RESIZABLE_SIDES },
    };

    const nextBoxes = [...boxes, newBox];
    setBoxes(nextBoxes);
    setSelectedBoxId(newId);
    commitToHistory(nextBoxes);
  }, [boxes, selectedBoxId, snapToGrid, gridSize, commitToHistory]);

  const handleUpdateBox = useCallback((id, patch, recordHistory = true) => {
    if (!id) return;
    setBoxes((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, ...patch } : b));
      if (recordHistory) {
        commitToHistory(updated);
      }
      return updated;
    });
  }, [commitToHistory]);

  const handleCommitCurrentState = useCallback(() => {
    commitToHistory(boxes);
  }, [boxes, commitToHistory]);

  const handleDeleteBox = useCallback((id) => {
    if (!id) return;
    setBoxes((prev) => {
      const nextBoxes = prev.filter((b) => b.id !== id);
      setSelectedBoxId((curr) => (curr === id ? nextBoxes[0]?.id || null : curr));
      commitToHistory(nextBoxes);
      return nextBoxes;
    });
  }, [commitToHistory]);

  const handleDuplicateBox = useCallback((id) => {
    if (!id) return;
    const target = boxes.find((b) => b.id === id);
    if (!target) return;
    const newId = `box-${Date.now()}`;
    const dupBox = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      x: target.x + 20,
      y: target.y + 20,
      zIndex: boxes.length + 1,
      resizableSides: target.resizableSides ? { ...target.resizableSides } : { ...DEFAULT_RESIZABLE_SIDES },
    };
    const nextBoxes = [...boxes, dupBox];
    setBoxes(nextBoxes);
    setSelectedBoxId(newId);
    commitToHistory(nextBoxes);
  }, [boxes, commitToHistory]);

  const handleClearAll = useCallback(() => {
    setBoxes([]);
    setSelectedBoxId(null);
    commitToHistory([]);
  }, [commitToHistory]);

  const handleLoadTemplate = useCallback((template) => {
    if (!template?.boxes) return;
    const cloned = normalizeBoxes(template.boxes, template.id || 'tpl');
    setBoxes(cloned);
    setSelectedBoxId(cloned[0]?.id || null);
    commitToHistory(cloned);
  }, [commitToHistory]);

  const selectedBox = boxes.find((b) => b.id === selectedBoxId) || null;

  return {
    boxes,
    selectedBox,
    selectedBoxId,
    gridSize,
    showGrid,
    snapToGrid,
    zoom,
    isExportOpen,
    isTemplatesOpen,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setSelectedBoxId,
    setGridSize,
    setShowGrid,
    setSnapToGrid,
    setZoom,
    setIsExportOpen,
    setIsTemplatesOpen,
    handleUndo,
    handleRedo,
    handleAddBox,
    handleUpdateBox,
    handleCommitCurrentState,
    handleDeleteBox,
    handleDuplicateBox,
    handleClearAll,
    handleLoadTemplate,
  };
}
