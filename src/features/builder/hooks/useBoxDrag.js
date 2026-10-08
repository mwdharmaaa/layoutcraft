import { useState, useCallback, useRef } from 'react';
import { snapToGridValue } from '../utils/snap_helpers';

export function useBoxDrag({
  box,
  zoom,
  gridSize,
  snapToGrid,
  onUpdateBox,
  onDragEnd,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initBoxX: 0, initBoxY: 0 });

  const handlePointerDown = useCallback((e) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;
    e.stopPropagation();

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initBoxX: box.x,
      initBoxY: box.y,
    };

    const handlePointerMove = (moveEvent) => {
      const scale = zoom / 100;
      const deltaX = (moveEvent.clientX - dragRef.current.startX) / scale;
      const deltaY = (moveEvent.clientY - dragRef.current.startY) / scale;

      let nextX = Math.max(0, dragRef.current.initBoxX + deltaX);
      let nextY = Math.max(0, dragRef.current.initBoxY + deltaY);

      if (snapToGrid) {
        nextX = snapToGridValue(nextX, gridSize, true);
        nextY = snapToGridValue(nextY, gridSize, true);
      } else {
        nextX = Math.round(nextX);
        nextY = Math.round(nextY);
      }

      onUpdateBox(box.id, { x: nextX, y: nextY }, false);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      onDragEnd?.();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [box.x, box.y, box.id, zoom, gridSize, snapToGrid, onUpdateBox, onDragEnd]);

  return {
    isDragging,
    handlePointerDown,
  };
}
