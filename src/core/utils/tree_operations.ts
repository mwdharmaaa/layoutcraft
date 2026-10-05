import type { LayoutNode } from '../types/element.types';
import { generateElementId } from './id_generator';

export function findNodeById(root: LayoutNode, id: string): LayoutNode | null {
  if (root.id === id) return root;
  if (!root.children) return null;

  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export function findParentNode(root: LayoutNode, targetId: string): LayoutNode | null {
  if (!root.children) return null;
  for (const child of root.children) {
    if (child.id === targetId) return root;
    const parent = findParentNode(child, targetId);
    if (parent) return parent;
  }
  return null;
}

export function updateNodeById(
  root: LayoutNode,
  id: string,
  transform: (node: LayoutNode) => LayoutNode
): LayoutNode {
  if (root.id === id) {
    return transform(root);
  }
  if (!root.children) return root;

  return {
    ...root,
    children: root.children.map((child) => updateNodeById(child, id, transform)),
  };
}

export function insertChildNode(
  root: LayoutNode,
  parentId: string,
  newNode: LayoutNode,
  index?: number
): LayoutNode {
  return updateNodeById(root, parentId, (parent) => {
    const children = parent.children ? [...parent.children] : [];
    if (typeof index === 'number' && index >= 0 && index <= children.length) {
      children.splice(index, 0, newNode);
    } else {
      children.push(newNode);
    }
    return { ...parent, children };
  });
}

export function removeNodeById(root: LayoutNode, id: string): LayoutNode {
  if (root.id === id) return root; // Root cannot be deleted
  if (!root.children) return root;

  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== id)
      .map((child) => removeNodeById(child, id)),
  };
}

export function cloneNodeWithNewIds(node: LayoutNode): LayoutNode {
  const newId = generateElementId(node.tag);
  return {
    ...node,
    id: newId,
    name: `${node.name} (Copy)`,
    children: node.children?.map(cloneNodeWithNewIds),
  };
}

export function duplicateNodeById(root: LayoutNode, id: string): LayoutNode {
  const parent = findParentNode(root, id);
  if (!parent || !parent.children) return root;

  const targetIndex = parent.children.findIndex((c) => c.id === id);
  if (targetIndex === -1) return root;

  const cloned = cloneNodeWithNewIds(parent.children[targetIndex]);
  return insertChildNode(root, parent.id, cloned, targetIndex + 1);
}

export function reorderChildNodes(
  root: LayoutNode,
  parentId: string,
  fromIndex: number,
  toIndex: number
): LayoutNode {
  return updateNodeById(root, parentId, (parent) => {
    if (!parent.children) return parent;
    const children = [...parent.children];
    if (fromIndex < 0 || fromIndex >= children.length) return parent;
    if (toIndex < 0 || toIndex >= children.length) return parent;

    const [moved] = children.splice(fromIndex, 1);
    children.splice(toIndex, 0, moved);
    return { ...parent, children };
  });
}
