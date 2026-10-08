/**
 * HTML layout exporter utility
 * Generates standalone production-grade HTML documents and provides browser download triggers.
 */

export function generateStandaloneHtml(boxes = [], options = {}) {
  const title = options.title || 'LayoutCraft Export';
  const maxBottom = boxes.reduce(
    (max, b) => Math.max(max, (b.y || 0) + (b.height || 0)),
    0
  );
  const containerHeight = Math.max(800, maxBottom + 64);
  const sorted = [...boxes].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

  const boxMarkup = sorted
    .map((b) => {
      const name = b.name || 'Box';
      const radius = b.borderRadius ?? 8;
      const z = b.zIndex || 1;
      return `      <!-- ${name} -->
      <div
        class="layout-box"
        style="left: ${b.x}px; top: ${b.y}px; width: ${b.width}px; height: ${b.height}px; background-color: ${b.color}; border: 1px solid ${b.borderColor}; border-radius: ${radius}px; color: ${b.textColor}; z-index: ${z};"
      >
        <span>${name}</span>
      </div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #09090b;
      color: #f4f4f5;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px 16px;
      overflow-x: auto;
    }
    .layout-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      overflow-x: auto;
    }
    .layout-viewport {
      position: relative;
      width: 1280px;
      min-height: ${containerHeight}px;
      background: #121215;
      border: 1px solid #27272a;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .layout-box {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 12px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.01em;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      box-sizing: border-box;
    }
    .layout-box:hover {
      filter: brightness(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body>
  <div class="layout-wrapper">
    <div class="layout-viewport">
${boxMarkup}
    </div>
  </div>
</body>
</html>`;
}

export function generateHtmlSnippet(boxes = []) {
  const maxBottom = boxes.reduce(
    (max, b) => Math.max(max, (b.y || 0) + (b.height || 0)),
    0
  );
  const containerHeight = Math.max(800, maxBottom + 64);
  const sorted = [...boxes].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

  const items = sorted
    .map((b) => {
      const radius = b.borderRadius ?? 8;
      const z = b.zIndex || 1;
      return `  <div class="box" style="left: ${b.x}px; top: ${b.y}px; width: ${b.width}px; height: ${b.height}px; background-color: ${b.color}; border: 1px solid ${b.borderColor}; border-radius: ${radius}px; color: ${b.textColor}; z-index: ${z};">
    <span>${b.name || 'Box'}</span>
  </div>`;
    })
    .join('\n');

  return `<div class="layout-container">
${items}
</div>

<style>
.layout-container {
  position: relative;
  width: 1280px;
  max-width: 100%;
  min-height: ${containerHeight}px;
  background: #121215;
  border: 1px solid #27272a;
  border-radius: 12px;
  overflow: hidden;
}
.box {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-sizing: border-box;
}
</style>`;
}

export function downloadFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadHtmlLayout(boxes = [], filename = 'layoutcraft-layout.html') {
  const html = generateStandaloneHtml(boxes);
  downloadFile(filename, html, 'text/html;charset=utf-8');
}
