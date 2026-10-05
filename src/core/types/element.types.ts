export type ElementCategory = 'container' | 'grid' | 'flex' | 'typography' | 'ui' | 'media';

export type DisplayType = 'flex' | 'grid' | 'block' | 'inline-block' | 'inline-flex';
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexJustify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexAlign = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface ElementStyles {
  // Layout
  display?: DisplayType;
  flexDirection?: FlexDirection;
  justifyContent?: FlexJustify;
  alignItems?: FlexAlign;
  flexWrap?: FlexWrap;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gap?: string;

  // Box Model
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  fontFamily?: string;

  // Appearance
  backgroundColor?: string;
  backgroundImage?: string;
  borderWidth?: string;
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: string;
  overflow?: 'visible' | 'hidden' | 'auto' | 'scroll';

  // Custom inline overrides
  customCss?: string;
}

export interface LayoutNode {
  id: string;
  name: string;
  tag: string;
  category: ElementCategory;
  styles: ElementStyles;
  content?: string;
  attributes?: Record<string, string>;
  children?: LayoutNode[];
  isLocked?: boolean;
  isHidden?: boolean;
}
