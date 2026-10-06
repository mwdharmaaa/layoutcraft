export function hasImageInClipboardData(clipboardData: DataTransfer | null): boolean {
  if (!clipboardData) return false;

  const files = clipboardData.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (
        f.type.startsWith('image/') ||
        /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(f.name) ||
        f.type === ''
      ) {
        return true;
      }
    }
  }

  const items = clipboardData.items;
  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/') || item.kind === 'file') {
        return true;
      }
    }
  }

  const html = clipboardData.getData('text/html');
  if (html && /<img[^>]+src=/i.test(html)) {
    return true;
  }

  const text = clipboardData.getData('text/plain')?.trim();
  if (text && (text.startsWith('data:image/') || /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(text))) {
    return true;
  }

  return false;
}

export function extractImageFromClipboard(
  clipboardData: DataTransfer | null
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!clipboardData) {
      resolve(null);
      return;
    }

    const readFile = (file: Blob) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        resolve(typeof ev.target?.result === 'string' ? ev.target.result : null);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    };

    // 1. Files array check
    const files = clipboardData.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file.type.startsWith('image/') ||
          /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(file.name) ||
          file.type === ''
        ) {
          readFile(file);
          return;
        }
      }
    }

    // 2. Items check
    const items = clipboardData.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/') || item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            readFile(file);
            return;
          }
        }
      }
    }

    // 3. HTML img tag extraction
    const html = clipboardData.getData('text/html');
    if (html) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const img = doc.querySelector('img');
        if (img?.src) {
          resolve(img.src);
          return;
        }
      } catch {
        const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) {
          resolve(match[1]);
          return;
        }
      }
    }

    // 4. Plain text data URI or image link fallback
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
  if (!navigator.clipboard) {
    return null;
  }

  if (typeof navigator.clipboard.read === 'function') {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          return await new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
              resolve(typeof ev.target?.result === 'string' ? ev.target.result : null);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        }
      }
    } catch {
      // Permission denied or reading blobs unsupported in current context
    }
  }

  if (typeof navigator.clipboard.readText === 'function') {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text.startsWith('data:image/')) {
        return text;
      }
      if (/^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(text)) {
        return text;
      }
    } catch {
      // Ignore readText failure
    }
  }

  return null;
}

export function extractTextFromClipboard(clipboardData: DataTransfer | null): string | null {
  if (!clipboardData) return null;
  const text = clipboardData.getData('text/plain')?.trim();
  return text || null;
}

export async function extractTextFromSystemClipboard(): Promise<string | null> {
  if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
    return null;
  }
  try {
    const text = (await navigator.clipboard.readText()).trim();
    return text || null;
  } catch {
    return null;
  }
}
