import type { FC, MouseEvent, FocusEvent, JSX } from 'react';
import type { LayoutNode } from '@/core/types/element.types';
import { stylesToCssProperties } from '@/core/utils/style_converter';
import { ElementBoundingBox } from './ElementBoundingBox';

interface CanvasRendererProps {
  node: LayoutNode;
  selectedId: string | null;
  hoveredId: string | null;
  isPreview: boolean;
  onSelect: (id: string, e: MouseEvent) => void;
  onHover: (id: string | null, e: MouseEvent) => void;
  onUpdateContent: (id: string, text: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
}

export const CanvasRenderer: FC<CanvasRendererProps> = ({
  node,
  selectedId,
  hoveredId,
  isPreview,
  onSelect,
  onHover,
  onUpdateContent,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  if (node.isHidden) return null;

  const isSelected = !isPreview && selectedId === node.id;
  const isHovered = !isPreview && hoveredId === node.id && !isSelected;
  const cssStyle = stylesToCssProperties(node.styles);

  const handleClick = (e: MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    onSelect(node.id, e);
  };

  const handleMouseEnter = (e: MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    onHover(node.id, e);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    onHover(null, e);
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    if (isPreview) return;
    onUpdateContent(node.id, e.currentTarget.innerText || '');
  };

  const outlineClasses = isSelected
    ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-zinc-900 relative'
    : isHovered
    ? 'ring-1 ring-blue-400/50 ring-dashed relative'
    : 'relative';

  const commonProps = {
    id: `canvas-${node.id}`,
    style: cssStyle,
    className: `${outlineClasses} transition-shadow`,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...node.attributes,
  };

  // Void tags (input, img)
  if (node.tag === 'input') {
    return (
      <div className="relative inline-block w-full">
        {isSelected && (
          <ElementBoundingBox
            node={node}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        )}
        <input {...commonProps} readOnly={!isPreview} />
      </div>
    );
  }

  if (node.tag === 'img') {
    const imgSrc = node.attributes?.src || node.content || '';
    return (
      <div className="relative inline-block max-w-full">
        {isSelected && (
          <ElementBoundingBox
            node={node}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        )}
        <img
          {...commonProps}
          src={imgSrc}
          alt={node.attributes?.alt || node.name || 'Image'}
          draggable={false}
        />
      </div>
    );
  }

  const Tag = (node.tag || 'div') as keyof JSX.IntrinsicElements;
  const canEditInline = !isPreview && isSelected && node.children?.length === 0;

  return (
    <Tag {...commonProps}>
      {isSelected && (
        <ElementBoundingBox
          node={node}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      )}

      {node.children && node.children.length > 0 ? (
        node.children.map((child) => (
          <CanvasRenderer
            key={child.id}
            node={child}
            selectedId={selectedId}
            hoveredId={hoveredId}
            isPreview={isPreview}
            onSelect={onSelect}
            onHover={onHover}
            onUpdateContent={onUpdateContent}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        ))
      ) : (
        <span
          contentEditable={canEditInline}
          suppressContentEditableWarning
          onBlur={handleBlur}
          className={canEditInline ? 'outline-none cursor-text' : ''}
        >
          {node.content}
        </span>
      )}
    </Tag>
  );
};
