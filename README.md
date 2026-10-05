# LayoutCraft Studio

LayoutCraft is a visual frontend layout designer and canvas studio built with React 19, TypeScript, Vite, and Tailwind CSS. It enables engineers and designers to construct responsive layouts using intuitive Flexbox and CSS Grid controls, inspect and edit styling properties in real time, and export production-ready code in standard HTML/CSS, React JSX, or JSON project schemas.

## Features

- **Interactive Canvas Artboard**: Test layouts across Desktop (1280px), Laptop (1024px), Tablet (768px), and Mobile (375px) viewports with zoom and snap-to-grid guidelines.
- **Visual Flexbox & Grid Engine**: Real-time controls for flex direction, alignment, distribution, wrapping, column templates, and gap spacing.
- **Component Palette**: Instant insertion of structural sections, 2/3-column grids, flex rows, typography scales, buttons, badges, and input elements.
- **DOM Layers Hierarchy**: Visual tree view of the component structure with expand/collapse, layer selection, visibility toggling, and deletion.
- **Property Inspector**: Tabbed controls for Layout, Box Model (Padding/Margin/Dimensions), Typography, and Appearance (Background, Border, Radius, Shadow, Opacity).
- **Inline Editing**: Double-click or select text elements to modify content directly on the canvas.
- **Layout Presets**: Pre-built templates including SaaS Bento Grid, High-Conversion Pricing Comparison, and Blank Canvas.
- **Multi-Format Code Exporter**: Instant generation of standard HTML/CSS, React TSX components, and JSON layout schemas with one-click clipboard copying and file downloads.
- **History & Keyboard Shortcuts**:
  - `Ctrl + Z`: Undo
  - `Ctrl + Y`: Redo
  - `Ctrl + D`: Duplicate selected element
  - `Delete` / `Backspace`: Delete selected element

## Architecture

LayoutCraft follows Semantic Atomic Architecture principles:
- **`src/core/types/`**: Element node interfaces, styling tokens, and studio state contracts.
- **`src/core/utils/`**: Immutable tree algorithms and CSS converter engines.
- **`src/core/constants/`**: Viewport configurations, color palettes, and default layouts.
- **`src/features/canvas/`**: Recursive DOM renderer, responsive artboard, and state hooks.
- **`src/features/palette/`**: Component palette catalog and left sidebar dock.
- **`src/features/inspector/`**: Atomic property editors for layout, spacing, typography, and styling.
- **`src/features/layers/`**: Hierarchical DOM tree navigator.
- **`src/features/export/`**: Multi-target code synthesis and project import/export modal.
- **`src/features/toolbar/`**: Studio top navigation and viewport switcher.

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Containerized Deployment (Docker)

Launch the complete application via the single-enter deployment script:

```bash
bash deploy.sh
```

Or run Docker Compose directly:

```bash
docker compose up -d --build
```

Access the studio at `http://localhost:3000`.

## License

MIT License
