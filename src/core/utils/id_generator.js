let counter = 1000;

export function generateElementId(prefix = 'node') {
  counter += 1;
  const timestamp = Date.now().toString(36).slice(-4);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${random}-${counter}`;
}
