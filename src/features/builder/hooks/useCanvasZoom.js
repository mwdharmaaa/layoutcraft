import { useEffect, useRef, useCallback } from 'react';

const MIN_ZOOM = 25;
const MAX_ZOOM = 250;
const ZOOM_STEP = 5;

export function useCanvasZoom({ zoom, onZoomChange, containerRef }) {
  const zoomRef = useRef(zoom);
  const onZoomChangeRef = useRef(onZoomChange);

  useEffect(() => {
    zoomRef.current = zoom;
    onZoomChangeRef.current = onZoomChange;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Handle Wheel & Trackpad Pinch
    const handleWheel = (e) => {
      // Trackpad pinch gesture sets e.ctrlKey = true in Chromium/Safari/Firefox
      // Also supports mouse wheel when Ctrl, Alt, or Meta is held
      if (e.ctrlKey || e.metaKey || e.altKey) {
        e.preventDefault();
        const current = zoomRef.current;
        const delta = -e.deltaY;
        const deltaZoom = delta > 0 ? ZOOM_STEP : -ZOOM_STEP;
        const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current + deltaZoom));
        if (nextZoom !== current) {
          onZoomChangeRef.current?.(nextZoom);
        }
      }
    };

    // Handle 2-finger Touch Pinch on touchscreens
    let initialTouchDist = null;
    let initialTouchZoom = null;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialTouchZoom = zoomRef.current;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && initialTouchDist && initialTouchZoom) {
        e.preventDefault();
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ratio = currentDist / initialTouchDist;
        const nextZoom = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, Math.round(initialTouchZoom * ratio))
        );
        onZoomChangeRef.current?.(nextZoom);
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        initialTouchDist = null;
        initialTouchZoom = null;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [containerRef]);

  const zoomIn = useCallback(() => {
    onZoomChange?.((prev) => Math.min(MAX_ZOOM, (typeof prev === 'number' ? prev : zoom) + 10));
  }, [onZoomChange, zoom]);

  const zoomOut = useCallback(() => {
    onZoomChange?.((prev) => Math.max(MIN_ZOOM, (typeof prev === 'number' ? prev : zoom) - 10));
  }, [onZoomChange, zoom]);

  const resetZoom = useCallback(() => {
    onZoomChange?.(100);
  }, [onZoomChange]);

  return {
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
