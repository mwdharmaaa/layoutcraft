import { useState, useCallback, useRef } from 'react';
import { snapToGridValue } from '../utils/snap_helpers';

const MIN_SIZE = 40;

export function useBoxResize({
  box,
  zoom,
  gridSize,
  snapToGrid,
  onUpdateBox,
  onResizeEnd,
}) {
  const [resizingDirection, setResizingDirection] = useState(null);
  const resizeRef = useRef(null);

  const startResize = useCallback((direction, e) => {
    e.stopPropagation();
    e.preventDefault();

    setResizingDirection(direction);
    resizeRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
      initX: box.x,
      initY: box.y,
      initW: box.width,
      initH: box.height,
    };

    const handlePointerMove = (moveEvent) => {
      if (!resizeRef.current) return;
      const { direction: dir, startX, startY, initX, initY, initW, initH } = resizeRef.current;
      const scale = zoom / 100;
      const deltaX = (moveEvent.clientX - startX) / scale;
      const deltaY = (moveEvent.clientY - startY) / scale;

      let nextX = initX;
      let nextY = initY;
      let nextW = initW;
      let nextH = initH;

      const rightEdge = initX + initW;
      const bottomEdge = initY + initH;

      // Handle horizontal resize
      if (dir.includes('e')) {
        let rawW = initW + deltaX;
        if (snapToGrid) {
          const rawRight = snapToGridValue(initX + rawW, gridSize, true);
          rawW = rawRight - initX;
        }
        nextW = Math.max(MIN_SIZE, Math.round(rawW));
      } else if (dir.includes('w')) {
        let targetX = initX + deltaX;
        if (snapToGrid) {
          targetX = snapToGridValue(targetX, gridSize, true);
        }
        targetX = Math.max(0, Math.min(targetX, rightEdge - MIN_SIZE));
        nextX = Math.round(targetX);
        nextW = rightEdge - nextX;
      }

      // Handle vertical resize
      if (dir.includes('s')) {
        let rawH = initH + deltaY;
        if (snapToGrid) {
          const rawBottom = snapToGridValue(initY + rawH, gridSize, true);
          rawH = rawBottom - initY;
        }
        nextH = Math.max(MIN_SIZE, Math.round(rawH));
      } else if (dir.includes('n')) {
        let targetY = initY + deltaY;
        if (snapToGrid) {
          targetY = snapToGridValue(targetY, gridSize, true);
        }
        targetY = Math.max(0, Math.min(targetY, bottomEdge - MIN_SIZE));
        nextY = Math.round(targetY);
        nextH = bottomEdge - nextY;
      }

      onUpdateBox(box.id, { x: nextX, y: nextY, width: nextW, height: nextH }, false);
    };

    const handlePointerUp = () => {
      setResizingDirection(null);
      resizeRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      onResizeEnd?.();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [box, zoom, gridSize, snapToGrid, onUpdateBox, onResizeEnd]);

  return {
    isResizing: Boolean(resizingDirection),
    resizingDirection,
    startResize,
  };
}
