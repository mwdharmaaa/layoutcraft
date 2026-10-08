import { useState, useCallback } from 'react';
import {
  DEFAULT_GRID_SIZE,
  BOX_PRESETS,
  INITIAL_BUILDER_BOXES,
} from '../constants/builder_defaults';
import { snapToGridValue } from '../utils/snap_helpers';

export function useLayoutBuilder() {
  const [boxes, setBoxes] = useState(INITIAL_BUILDER_BOXES);
  const [selectedBoxId, setSelectedBoxId] = useState('box-1');
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // History stack
  const [history, setHistory] = useState([INITIAL_BUILDER_BOXES]);
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

  const handleAddBox = useCallback((preset = BOX_PRESETS[0]) => {
    const newId = `box-${Date.now()}`;
    const offset = (boxes.length * 20) % 200;
    const rawX = 60 + offset;
    const rawY = 60 + offset;

    const newBox = {
      id: newId,
      name: `${preset.name} ${boxes.length + 1}`,
      x: snapToGrid ? snapToGridValue(rawX, gridSize) : rawX,
      y: snapToGrid ? snapToGridValue(rawY, gridSize) : rawY,
      width: preset.width || 280,
      height: preset.height || 180,
      color: preset.color || '#18181b',
      borderColor: preset.borderColor || '#27272a',
      textColor: preset.textColor || '#f4f4f5',
      borderRadius: 8,
      zIndex: boxes.length + 1,
    };

    const nextBoxes = [...boxes, newBox];
    setBoxes(nextBoxes);
    setSelectedBoxId(newId);
    commitToHistory(nextBoxes);
  }, [boxes, snapToGrid, gridSize, commitToHistory]);

  const handleUpdateBox = useCallback((id, patch, recordHistory = true) => {
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
    const nextBoxes = boxes.filter((b) => b.id !== id);
    setBoxes(nextBoxes);
    setSelectedBoxId(nextBoxes[0]?.id || null);
    commitToHistory(nextBoxes);
  }, [boxes, commitToHistory]);

  const handleDuplicateBox = useCallback((id) => {
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
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setSelectedBoxId,
    setGridSize,
    setShowGrid,
    setSnapToGrid,
    setZoom,
    setIsExportOpen,
    handleUndo,
    handleRedo,
    handleAddBox,
    handleUpdateBox,
    handleCommitCurrentState,
    handleDeleteBox,
    handleDuplicateBox,
    handleClearAll,
  };
}
