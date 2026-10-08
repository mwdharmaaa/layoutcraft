export function snapToGridValue(val, gridSize = 20, enabled = true) {
  if (!enabled || gridSize <= 0) return Math.round(val);
  return Math.round(val / gridSize) * gridSize;
}

export function clamp(val, min, max) {
  if (min !== undefined && val < min) return min;
  if (max !== undefined && val > max) return max;
  return val;
}

export function getCanvasCoords(event, canvasElement, zoom = 1) {
  if (!canvasElement) return { x: event.clientX, y: event.clientY };
  const rect = canvasElement.getBoundingClientRect();
  const scale = zoom / 100;
  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale,
  };
}
