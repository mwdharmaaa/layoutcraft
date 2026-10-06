/**
 * @typedef {'container' | 'grid' | 'flex' | 'typography' | 'ui' | 'media'} ElementCategory
 * @typedef {'flex' | 'grid' | 'block' | 'inline-block' | 'inline-flex'} DisplayType
 * @typedef {'row' | 'column' | 'row-reverse' | 'column-reverse'} FlexDirection
 * @typedef {'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'} FlexJustify
 * @typedef {'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'} FlexAlign
 * @typedef {'nowrap' | 'wrap' | 'wrap-reverse'} FlexWrap
 *
 * @typedef {Object} ElementStyles
 * @property {DisplayType} [display]
 * @property {FlexDirection} [flexDirection]
 * @property {FlexJustify} [justifyContent]
 * @property {FlexAlign} [alignItems]
 * @property {FlexWrap} [flexWrap]
 * @property {string} [gridTemplateColumns]
 * @property {string} [gridTemplateRows]
 * @property {string} [gap]
 * @property {string} [width]
 * @property {string} [height]
 * @property {string} [minWidth]
 * @property {string} [maxWidth]
 * @property {string} [minHeight]
 * @property {string} [maxHeight]
 * @property {string} [paddingTop]
 * @property {string} [paddingRight]
 * @property {string} [paddingBottom]
 * @property {string} [paddingLeft]
 * @property {string} [marginTop]
 * @property {string} [marginRight]
 * @property {string} [marginBottom]
 * @property {string} [marginLeft]
 * @property {string} [fontSize]
 * @property {string} [fontWeight]
 * @property {string} [lineHeight]
 * @property {string} [letterSpacing]
 * @property {'left' | 'center' | 'right' | 'justify'} [textAlign]
 * @property {string} [color]
 * @property {string} [fontFamily]
 * @property {string} [backgroundColor]
 * @property {string} [backgroundImage]
 * @property {string} [borderWidth]
 * @property {'none' | 'solid' | 'dashed' | 'dotted'} [borderStyle]
 * @property {string} [borderColor]
 * @property {string} [borderRadius]
 * @property {string} [boxShadow]
 * @property {string} [opacity]
 * @property {'visible' | 'hidden' | 'auto' | 'scroll'} [overflow]
 * @property {string} [customCss]
 *
 * @typedef {Object} LayoutNode
 * @property {string} id
 * @property {string} name
 * @property {string} tag
 * @property {ElementCategory} category
 * @property {ElementStyles} styles
 * @property {string} [content]
 * @property {Record<string, string>} [attributes]
 * @property {LayoutNode[]} [children]
 * @property {boolean} [isLocked]
 * @property {boolean} [isHidden]
 */

export const ELEMENT_CATEGORIES = ['container', 'grid', 'flex', 'typography', 'ui', 'media'];
