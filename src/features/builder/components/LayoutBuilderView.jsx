import { useLayoutBuilder } from '../hooks/useLayoutBuilder';
import { BuilderHeader } from './BuilderHeader';
import { BuilderCanvas } from './BuilderCanvas';
import { BoxPropertyBar } from './BoxPropertyBar';
import { BuilderExportModal } from './BuilderExportModal';
import { BuilderTemplatesModal } from './BuilderTemplatesModal';
import { downloadHtmlLayout } from '../utils/html_exporter';
import { useToast } from '@/features/toast/hooks/useToast';
import { ToastNotification } from '@/features/toast/components/ToastNotification';
import { AmbientGlow } from '@/features/home/components/AmbientGlow';

export const LayoutBuilderView = ({ onBackToMenu, initialTemplate, initialBoxes }) => {
  const { toasts, showToast } = useToast();
  const effectiveInitialBoxes = initialTemplate?.boxes || initialBoxes;
  const {
    boxes,
    selectedBox,
    selectedBoxId,
    gridSize,
    showGrid,
    snapToGrid,
    zoom,
    isExportOpen,
    isTemplatesOpen,
    canUndo,
    canRedo,
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
  } = useLayoutBuilder(effectiveInitialBoxes);

  const handleDownloadHtml = () => {
    downloadHtmlLayout(boxes);
    showToast('HTML layout downloaded successfully', 'success');
  };

  return (
    <div className="relative flex flex-col w-screen h-screen overflow-hidden bg-canvas-texture text-slate-100 font-sans select-none">
      {/* Background Lighting from landing page */}
      <AmbientGlow />

      {/* Top Header */}
      <BuilderHeader
        onBackToMenu={onBackToMenu}
        gridSize={gridSize}
        onChangeGridSize={setGridSize}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid((p) => !p)}
        snapToGrid={snapToGrid}
        onToggleSnap={() => setSnapToGrid((p) => !p)}
        zoom={zoom}
        onZoomChange={setZoom}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onAddBox={handleAddBox}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onClearCanvas={handleClearAll}
        onOpenExport={() => setIsExportOpen(true)}
        onDownloadHtml={handleDownloadHtml}
      />

      {/* Main Builder Workspace */}
      <div className="flex flex-1 overflow-hidden relative w-full h-full min-h-0 min-w-0">
        <BuilderCanvas
          boxes={boxes}
          selectedBoxId={selectedBoxId}
          gridSize={gridSize}
          showGrid={showGrid}
          snapToGrid={snapToGrid}
          zoom={zoom}
          onZoomChange={setZoom}
          onAddBox={handleAddBox}
          onSelectBox={setSelectedBoxId}
          onUpdateBox={handleUpdateBox}
          onCommitState={handleCommitCurrentState}
          onDuplicateBox={handleDuplicateBox}
          onDeleteBox={handleDeleteBox}
        />

        <BoxPropertyBar
          selectedBox={selectedBox}
          onUpdateBox={handleUpdateBox}
          onDuplicateBox={handleDuplicateBox}
          onDeleteBox={handleDeleteBox}
        />
      </div>

      {/* Export Modal */}
      <BuilderExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        boxes={boxes}
      />

      {/* Templates Modal */}
      <BuilderTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(template) => {
          handleLoadTemplate(template);
          showToast(`Loaded "${template.name}" template`, 'success');
        }}
      />

      {/* Action Feedback Toasts */}
      <ToastNotification toasts={toasts} />
    </div>
  );
};
