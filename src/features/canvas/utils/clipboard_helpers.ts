export function isImageUrl(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.startsWith('data:image/')) return true;
  if (/^https?:\/\/.+\.(png|jpe?g|webp|gif|svg|bmp|avif)(\?.*)?$/i.test(trimmed)) return true;
  if (/^https?:\/\/(i\.pinimg\.com|images\.unsplash\.com|cdn\.|images\.).+/i.test(trimmed)) return true;
  return false;
}

export function hasImageInClipboardData(clipboardData: DataTransfer | null): boolean {
  if (!clipboardData) return false;

  const files = clipboardData.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (
        f.type.startsWith('image/') ||
        /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i.test(f.name) ||
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
  if (text && isImageUrl(text)) {
    return true;
  }

  return false;
}

export interface ExtractedImageInfo {
  dataUrl: string;
  isCopiedImage: boolean;
  isScreenshot: boolean;
  name?: string;
  alt?: string;
}

export function extractImageDetailsFromClipboard(
  clipboardData: DataTransfer | null
): Promise<ExtractedImageInfo | null> {
  return new Promise((resolve) => {
    if (!clipboardData) {
      resolve(null);
      return;
    }

    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain')?.trim();
    const hasHtml = Boolean(html && html.trim());
    const types = Array.from(clipboardData.types || []);
    const hasHtmlType = types.includes('text/html');

    let htmlImgSrc: string | null = null;
    let htmlImgAlt: string | null = null;

    if (hasHtml) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const img = doc.querySelector('img');
        if (img?.src) {
          htmlImgSrc = img.src;
          htmlImgAlt = img.getAttribute('alt') || null;
        }
      } catch {
        const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match?.[1]) {
          htmlImgSrc = match[1];
        }
      }
    }

    const readBlob = (blob: Blob): Promise<string | null> => {
      return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          res(typeof ev.target?.result === 'string' ? ev.target.result : null);
        };
        reader.onerror = () => res(null);
        reader.readAsDataURL(blob);
      });
    };

    // 1. Files array check (File copy from explorer or dropped file)
    const files = clipboardData.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImgType = file.type.startsWith('image/');
        const hasImgExt = /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i.test(file.name);

        if (isImgType || hasImgExt) {
          readBlob(file).then((dataUrl) => {
            if (dataUrl) {
              const isSynthetic = file.name.toLowerCase() === 'image.png' && !hasHtml && !hasHtmlType;
              const isCopied = !isSynthetic || Boolean(htmlImgSrc);
              const cleanName = !isSynthetic ? file.name.replace(/\.[^.]+$/, '') : (htmlImgAlt || 'Image');
              resolve({
                dataUrl,
                isCopiedImage: isCopied,
                isScreenshot: !isCopied,
                name: cleanName || 'Image',
                alt: htmlImgAlt || (isCopied ? 'Copied Image' : 'Pasted Screenshot'),
              });
            } else {
              resolve(null);
            }
          });
          return;
        }
      }
    }

    // 2. Items check (Image blob)
    const items = clipboardData.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            readBlob(file).then((dataUrl) => {
              if (dataUrl) {
                const isCopied = hasHtml || hasHtmlType || Boolean(htmlImgSrc);
                resolve({
                  dataUrl,
                  isCopiedImage: isCopied,
                  isScreenshot: !isCopied,
                  name: htmlImgAlt ? htmlImgAlt.slice(0, 30) : (isCopied ? 'Image' : 'Screenshot Image'),
                  alt: htmlImgAlt || (isCopied ? 'Copied Image' : 'Pasted Screenshot'),
                });
              } else {
                resolve(null);
              }
            });
            return;
          }
        }
      }
    }

    // 3. HTML img src extraction without blob
    if (htmlImgSrc) {
      resolve({
        dataUrl: htmlImgSrc,
        isCopiedImage: true,
        isScreenshot: false,
        name: htmlImgAlt ? htmlImgAlt.slice(0, 30) : 'Image',
        alt: htmlImgAlt || 'Copied Image',
      });
      return;
    }

    // 4. Plain text URL or data URI
    if (text && isImageUrl(text)) {
      resolve({
        dataUrl: text,
        isCopiedImage: true,
        isScreenshot: false,
        name: 'Image',
        alt: 'Copied Image',
      });
      return;
    }

    resolve(null);
  });
}

export async function extractImageFromClipboard(
  clipboardData: DataTransfer | null
): Promise<string | null> {
  const details = await extractImageDetailsFromClipboard(clipboardData);
  return details?.dataUrl ?? null;
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

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(fallback);
      }
    }, ms);
    promise
      .then((val) => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(val);
        }
      })
      .catch(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(fallback);
        }
      });
  });
}

export async function extractNodeFromSystemClipboard(
  timeoutMs: number = 200
): Promise<import('@/core/types/element.types').LayoutNode | null> {
  if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
    return null;
  }

  const queryAsync = async () => {
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
  };

  return withTimeout(queryAsync(), timeoutMs, null);
}

export async function extractImageDetailsFromSystemClipboard(
  timeoutMs: number = 200
): Promise<ExtractedImageInfo | null> {
  if (!navigator.clipboard) {
    return null;
  }

  const queryAsync = async (): Promise<ExtractedImageInfo | null> => {
    if (typeof navigator.clipboard.read === 'function') {
      try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((t) => t.startsWith('image/'));
          const hasHtml = item.types.includes('text/html');

          if (imageType) {
            const blob = await item.getType(imageType);
            const dataUrl = await new Promise<string | null>((resolve) => {
              const reader = new FileReader();
              reader.onload = (ev) => {
                resolve(typeof ev.target?.result === 'string' ? ev.target.result : null);
              };
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(blob);
            });

            if (dataUrl) {
              let altText: string | null = null;
              if (hasHtml) {
                try {
                  const htmlBlob = await item.getType('text/html');
                  const htmlText = await htmlBlob.text();
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(htmlText, 'text/html');
                  const img = doc.querySelector('img');
                  if (img) {
                    altText = img.getAttribute('alt') || null;
                  }
                } catch {
                  // Ignore html read failure
                }
              }

              const isCopied = hasHtml;
              return {
                dataUrl,
                isCopiedImage: isCopied,
                isScreenshot: !isCopied,
                name: altText ? altText.slice(0, 30) : (isCopied ? 'Image' : 'Screenshot Image'),
                alt: altText || (isCopied ? 'Copied Image' : 'Pasted Screenshot'),
              };
            }
          }
        }
      } catch {
        // Permission denied or reading blobs unsupported
      }
    }

    if (typeof navigator.clipboard.readText === 'function') {
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (isImageUrl(text)) {
          return {
            dataUrl: text,
            isCopiedImage: true,
            isScreenshot: false,
            name: 'Image',
            alt: 'Copied Image',
          };
        }
      } catch {
        // Ignore readText failure
      }
    }

    return null;
  };

  return withTimeout(queryAsync(), timeoutMs, null);
}

export async function extractImageFromSystemClipboard(timeoutMs: number = 200): Promise<string | null> {
  const details = await extractImageDetailsFromSystemClipboard(timeoutMs);
  return details?.dataUrl ?? null;
}

export function extractTextFromClipboard(clipboardData: DataTransfer | null): string | null {
  if (!clipboardData) return null;
  const text = clipboardData.getData('text/plain')?.trim();
  return text || null;
}

export async function extractTextFromSystemClipboard(timeoutMs: number = 200): Promise<string | null> {
  if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
    return null;
  }
  const queryAsync = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      return text || null;
    } catch {
      return null;
    }
  };

  return withTimeout(queryAsync(), timeoutMs, null);
}
