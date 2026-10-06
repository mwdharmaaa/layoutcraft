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

    resolve(null);
  });
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
