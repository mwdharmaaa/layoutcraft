import { useState, useCallback, useRef, useEffect } from 'react';
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

  const paramsRef = useRef({
    box,
    zoom,
    gridSize,
    snapToGrid,
    onUpdateBox,
    onResizeEnd,
  });

  useEffect(() => {
    paramsRef.current = {
      box,
      zoom,
      gridSize,
      snapToGrid,
      onUpdateBox,
      onResizeEnd,
    };
  });

  const startResize = useCallback((direction, e) => {
    e.stopPropagation();
    e.preventDefault();

    const targetElement = e.currentTarget;
    const pointerId = e.pointerId;

    if (targetElement && typeof targetElement.setPointerCapture === 'function') {
      try {
        targetElement.setPointerCapture(pointerId);
      } catch {
        // Fallback if pointer capture is not supported
      }
    }

    setResizingDirection(direction);
    resizeRef.current = {
      direction,
      targetElement,
      pointerId,
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
      const { zoom: currentZoom, gridSize: currentGrid, snapToGrid: currentSnap, onUpdateBox: updateFn } = paramsRef.current;

      const scale = (currentZoom || 100) / 100;
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
        if (currentSnap) {
          const rawRight = snapToGridValue(initX + rawW, currentGrid, true);
          rawW = rawRight - initX;
        }
        nextW = Math.max(MIN_SIZE, Math.round(rawW));
      } else if (dir.includes('w')) {
        let targetX = initX + deltaX;
        if (currentSnap) {
          targetX = snapToGridValue(targetX, currentGrid, true);
        }
        targetX = Math.max(0, Math.min(targetX, rightEdge - MIN_SIZE));
        nextX = Math.round(targetX);
        nextW = rightEdge - nextX;
      }

      // Handle vertical resize
      if (dir.includes('s')) {
        let rawH = initH + deltaY;
        if (currentSnap) {
          const rawBottom = snapToGridValue(initY + rawH, currentGrid, true);
          rawH = rawBottom - initY;
        }
        nextH = Math.max(MIN_SIZE, Math.round(rawH));
      } else if (dir.includes('n')) {
        let targetY = initY + deltaY;
        if (currentSnap) {
          targetY = snapToGridValue(targetY, currentGrid, true);
        }
        targetY = Math.max(0, Math.min(targetY, bottomEdge - MIN_SIZE));
        nextY = Math.round(targetY);
        nextH = bottomEdge - nextY;
      }

      updateFn(box.id, { x: nextX, y: nextY, width: nextW, height: nextH }, false);
    };

    const handlePointerUp = () => {
      if (resizeRef.current) {
        const { targetElement: el, pointerId: pid } = resizeRef.current;
        if (el && typeof el.releasePointerCapture === 'function') {
          try {
            el.releasePointerCapture(pid);
          } catch {
            // Ignore if release fails
          }
        }
      }
      setResizingDirection(null);
      resizeRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      paramsRef.current.onResizeEnd?.();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }, [box.x, box.y, box.width, box.height, box.id]);

  useEffect(() => {
    return () => {
      if (resizeRef.current) {
        setResizingDirection(null);
        resizeRef.current = null;
      }
    };
  }, []);

  return {
    isResizing: Boolean(resizingDirection),
    resizingDirection,
    startResize,
  };
}
