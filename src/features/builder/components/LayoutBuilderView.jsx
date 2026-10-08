import { useLayoutBuilder } from '../hooks/useLayoutBuilder';
import { BuilderHeader } from './BuilderHeader';
import { BuilderCanvas } from './BuilderCanvas';
import { BoxPropertyBar } from './BoxPropertyBar';
import { BuilderExportModal } from './BuilderExportModal';
import { boxesToStudioRoot } from '../utils/box_converter';

export const LayoutBuilderView = ({ onBack, onApplyToStudio }) => {
  const {
    boxes,
    selectedBox,
    selectedBoxId,
    gridSize,
    showGrid,
    snapToGrid,
    zoom,
    isExportOpen,
    canUndo,
    canRedo,
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
  } = useLayoutBuilder();

  const handleApply = () => {
    const rootNode = boxesToStudioRoot(boxes);
    onApplyToStudio(rootNode);
  };

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Header */}
      <BuilderHeader
        onBack={onBack}
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
        onClearCanvas={handleClearAll}
        onOpenExport={() => setIsExportOpen(true)}
        onApplyToStudio={handleApply}
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
        onApplyToStudio={handleApply}
      />
    </div>
  );
};
