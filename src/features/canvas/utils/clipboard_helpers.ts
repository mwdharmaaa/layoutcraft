export function extractImageFromClipboard(
  clipboardData: DataTransfer | null
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!clipboardData) {
      resolve(null);
      return;
    }

    // 1. Prioritize files list (direct screenshots in Windows/Chrome)
    const files = clipboardData.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (typeof ev.target?.result === 'string') {
              resolve(ev.target.result);
            } else {
              resolve(null);
            }
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
          return;
        }
      }
    }

    // 2. Fallback to items iteration
    const items = clipboardData.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              if (typeof ev.target?.result === 'string') {
                resolve(ev.target.result);
              } else {
                resolve(null);
              }
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
            return;
          }
        }
      }
    }

    // 3. Fallback to HTML img tag extraction
    const html = clipboardData.getData('text/html');
    if (html) {
      const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        resolve(match[1]);
        return;
      }
    }

    // 4. Fallback to direct image data-url or image link in plain text
    const text = clipboardData.getData('text/plain')?.trim();
    if (text) {
      if (text.startsWith('data:image/')) {
        resolve(text);
        return;
      }
      if (/^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(text)) {
        resolve(text);
        return;
      }
    }

    resolve(null);
  });
}

export function extractNodeFromClipboard(
  clipboardData: DataTransfer | null
): import('@/core/types/element.types').LayoutNode | null {
  if (!clipboardData) return null;
  const text = clipboardData.getData('text/plain')?.trim();
  if (!text || !text.startsWith('{')) return null;

  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.tag && parsed.styles) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export async function extractNodeFromSystemClipboard(): Promise<
  import('@/core/types/element.types').LayoutNode | null
> {
  if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
    return null;
  }

  try {
    const text = (await navigator.clipboard.readText()).trim();
    if (!text || !text.startsWith('{')) return null;
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && parsed.id && parsed.tag && parsed.styles) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export async function extractImageFromSystemClipboard(): Promise<string | null> {
  if (!navigator.clipboard || typeof navigator.clipboard.read !== 'function') {
    return null;
  }

  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const imageType = item.types.find((t) => t.startsWith('image/'));
      if (imageType) {
        const blob = await item.getType(imageType);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (typeof ev.target?.result === 'string') {
              resolve(ev.target.result);
            } else {
              resolve(null);
            }
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        });
      }
    }
  } catch {
    return null;
  }

  return null;
}
