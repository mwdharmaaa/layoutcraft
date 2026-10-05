import React from 'react';
import { StudioHeader } from '@/features/toolbar/components/StudioHeader';
import { StudioSidebar } from '@/features/palette/components/StudioSidebar';
import { CanvasArtboard } from '@/features/canvas/components/CanvasArtboard';
import { PropertyInspector } from '@/features/inspector/components/PropertyInspector';
import { ExportModal } from '@/features/export/components/ExportModal';
import { useStudioState } from '@/features/canvas/hooks/useStudioState';

export default function App() {
  const {
    rootNode,
    selectedId,
    selectedNode,
    hoveredId,
    viewport,
    zoom,
    showGrid,
    isPreview,
    sidebarTab,
    inspectorTab,
    isExportOpen,
    canUndo,
    canRedo,
    setHoveredId,
    setViewport,
    setZoom,
    setShowGrid,
    setIsPreview,
    setSidebarTab,
    setInspectorTab,
    setIsExportOpen,
    handleUndo,
    handleRedo,
    handleSelectNode,
    handleInsertNode,
    handleUpdateStyles,
    handleUpdateContent,
    handleUpdateName,
    handleDeleteNode,
    handleDuplicateNode,
    handleMoveOrder,
    handleToggleVisibility,
    handleSelectTemplate,
    handleImportLayout,
    handleClearCanvas,
  } = useStudioState();

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Studio Top Navigation Bar */}
      <StudioHeader
        viewport={viewport}
        onViewportChange={setViewport}
        zoom={zoom}
        onZoomChange={setZoom}
        showGrid={showGrid}
        onToggleGrid={setShowGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isPreview={isPreview}
        onTogglePreview={setIsPreview}
        onOpenExport={() => setIsExportOpen(true)}
        onClearCanvas={handleClearCanvas}
      />

      {/* Main Workspace Workspace Dock */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Dock: Blocks, Layers, Templates */}
        {!isPreview && (
          <StudioSidebar
            activeTab={sidebarTab}
            onTabChange={setSidebarTab}
            onInsertNode={handleInsertNode}
            rootNode={rootNode}
            selectedId={selectedId}
            onSelectNode={handleSelectNode}
            onToggleVisibility={handleToggleVisibility}
            onDeleteNode={handleDeleteNode}
            onSelectTemplate={handleSelectTemplate}
          />
        )}

        {/* Center Canvas Viewport */}
        <CanvasArtboard
          rootNode={rootNode}
          selectedId={selectedId}
          hoveredId={hoveredId}
          viewport={viewport}
          zoom={zoom}
          showGrid={showGrid}
          isPreview={isPreview}
          onSelect={(id) => handleSelectNode(id)}
          onHover={(id) => setHoveredId(id)}
          onUpdateContent={handleUpdateContent}
          onDuplicate={handleDuplicateNode}
          onDelete={handleDeleteNode}
          onMoveUp={(id) => handleMoveOrder(id, 'up')}
          onMoveDown={(id) => handleMoveOrder(id, 'down')}
          onCanvasClick={() => handleSelectNode(rootNode.id)}
        />

        {/* Right Dock: Property Inspector */}
        {!isPreview && (
          <PropertyInspector
            selectedNode={selectedNode}
            activeTab={inspectorTab}
            onTabChange={setInspectorTab}
            onUpdateStyles={handleUpdateStyles}
            onUpdateContent={(txt) => selectedId && handleUpdateContent(selectedId, txt)}
            onUpdateName={handleUpdateName}
          />
        )}
      </div>

      {/* Code Export & Project Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        rootNode={rootNode}
        onImportLayout={handleImportLayout}
      />
    </div>
  );
}
