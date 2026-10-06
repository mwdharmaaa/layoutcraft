import { stylesToCssString } from '@/core/utils/style_converter';

function renderHtmlNode(node, indent = '  ') {
  const inlineCss = stylesToCssString(node.styles);
  const styleAttr = inlineCss ? ` style="${inlineCss}"` : '';
  const attrEntries = Object.entries(node.attributes || {});
  const extraAttrs = attrEntries.length > 0
    ? ' ' + attrEntries.map(([k, v]) => `${k}="${v}"`).join(' ')
    : '';

  const tag = node.tag || 'div';
  const isVoid = ['input', 'img', 'hr', 'br'].includes(tag);

  if (isVoid) {
    return `${indent}<${tag}${styleAttr}${extraAttrs} />\n`;
  }

  const childrenHtml = (node.children || [])
    .map((c) => renderHtmlNode(c, indent + '  '))
    .join('');

  const content = node.content ? `${node.content}` : '';

  if (!childrenHtml && content) {
    return `${indent}<${tag}${styleAttr}${extraAttrs}>${content}</${tag}>\n`;
  }

  return `${indent}<${tag}${styleAttr}${extraAttrs}>\n${childrenHtml}${indent}</${tag}>\n`;
}

export function generateStandardHtml(root) {
  const bodyContent = renderHtmlNode(root, '    ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LayoutCraft Export</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #09090b; color: #fafafa; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

export function generateReactJsx(node, indent = '    ') {
  const styleObj = JSON.stringify(node.styles);
  const tag = node.tag || 'div';
  const isVoid = ['input', 'img', 'hr', 'br'].includes(tag);
  const attrEntries = Object.entries(node.attributes || {});
  const extraProps = attrEntries.length > 0
    ? ' ' + attrEntries.map(([k, v]) => `${k}="${v}"`).join(' ')
    : '';

  if (isVoid) {
    return `${indent}<${tag} style={${styleObj}}${extraProps} />\n`;
  }

  const childrenCode = (node.children || [])
    .map((c) => generateReactJsx(c, indent + '  '))
    .join('');

  const content = node.content ? node.content : '';

  if (!childrenCode && content) {
    return `${indent}<${tag} style={${styleObj}}>${content}</${tag}>\n`;
  }

  return `${indent}<${tag} style={${styleObj}}>\n${childrenCode}${indent}</${tag}>\n`;
}

export function generateReactComponent(root) {
  const jsxTree = generateReactJsx(root, '    ');
  return `import React from 'react';

export default function LayoutExport() {
  return (
${jsxTree}  );
}
`;
}

export function generateProjectJson(root) {
  return JSON.stringify(root, null, 2);
}
