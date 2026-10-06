import { useState, useEffect, useRef, type FC, type MouseEvent, type FocusEvent, type JSX } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const isSelected = !isPreview && selectedId === node.id;
  const isHovered = !isPreview && hoveredId === node.id && !isSelected;
  const isEditingActive = isSelected && isEditing;
  const cssStyle = stylesToCssProperties(node.styles);

  useEffect(() => {
    if (isEditingActive && spanRef.current) {
      spanRef.current.focus();
      try {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(spanRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      } catch {
        // Fallback if range creation fails
      }
    }
  }, [isEditingActive]);

  if (node.isHidden) return null;

  const handleClick = (e: MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    onSelect(node.id, e);
  };

  const handleDoubleClick = (e: MouseEvent) => {
    if (isPreview || (node.children && node.children.length > 0)) return;
    e.stopPropagation();
    setIsEditing(true);
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
    setIsEditing(false);
    onUpdateContent(node.id, e.currentTarget.innerText || '');
  };

  const handleSpanKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      e.currentTarget.blur();
    }
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
    onDoubleClick: handleDoubleClick,
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
  const isLeafText = !node.children || node.children.length === 0;
  const canEditInline = !isPreview && isEditingActive && isLeafText;

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
          ref={spanRef}
          contentEditable={canEditInline}
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleSpanKeyDown}
          onDoubleClick={handleDoubleClick}
          className={canEditInline ? 'outline-none cursor-text' : isSelected ? 'cursor-pointer' : ''}
        >
          {node.content}
        </span>
      )}
    </Tag>
  );
};
