import type { CSSProperties } from 'react';
import type { ElementStyles } from '../types/element.types';

export function stylesToCssProperties(styles: ElementStyles): CSSProperties {
  const css: CSSProperties = {};

  if (styles.display) css.display = styles.display;
  if (styles.flexDirection) css.flexDirection = styles.flexDirection;
  if (styles.justifyContent) css.justifyContent = styles.justifyContent;
  if (styles.alignItems) css.alignItems = styles.alignItems;
  if (styles.flexWrap) css.flexWrap = styles.flexWrap;
  if (styles.gridTemplateColumns) css.gridTemplateColumns = styles.gridTemplateColumns;
  if (styles.gridTemplateRows) css.gridTemplateRows = styles.gridTemplateRows;
  if (styles.gap) css.gap = styles.gap;

  if (styles.width) css.width = styles.width;
  if (styles.height) css.height = styles.height;
  if (styles.minWidth) css.minWidth = styles.minWidth;
  if (styles.maxWidth) css.maxWidth = styles.maxWidth;
  if (styles.minHeight) css.minHeight = styles.minHeight;
  if (styles.maxHeight) css.maxHeight = styles.maxHeight;

  if (styles.paddingTop) css.paddingTop = styles.paddingTop;
  if (styles.paddingRight) css.paddingRight = styles.paddingRight;
  if (styles.paddingBottom) css.paddingBottom = styles.paddingBottom;
  if (styles.paddingLeft) css.paddingLeft = styles.paddingLeft;

  if (styles.marginTop) css.marginTop = styles.marginTop;
  if (styles.marginRight) css.marginRight = styles.marginRight;
  if (styles.marginBottom) css.marginBottom = styles.marginBottom;
  if (styles.marginLeft) css.marginLeft = styles.marginLeft;

  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.letterSpacing) css.letterSpacing = styles.letterSpacing;
  if (styles.textAlign) css.textAlign = styles.textAlign;
  if (styles.color) css.color = styles.color;
  if (styles.fontFamily) css.fontFamily = styles.fontFamily;

  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor;
  if (styles.backgroundImage) css.backgroundImage = styles.backgroundImage;
  if (styles.borderWidth) css.borderWidth = styles.borderWidth;
  if (styles.borderStyle) css.borderStyle = styles.borderStyle;
  if (styles.borderColor) css.borderColor = styles.borderColor;
  if (styles.borderRadius) css.borderRadius = styles.borderRadius;
  if (styles.boxShadow) css.boxShadow = styles.boxShadow;
  if (styles.opacity) css.opacity = styles.opacity;
  if (styles.overflow) css.overflow = styles.overflow;

  return css;
}

export function stylesToCssString(styles: ElementStyles): string {
  const css = stylesToCssProperties(styles);
  return Object.entries(css)
    .map(([key, val]) => {
      const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebab}: ${val};`;
    })
    .join(' ');
}
