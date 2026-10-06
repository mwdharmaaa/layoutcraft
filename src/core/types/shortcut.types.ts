export interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  keys: string[];
  category: 'clipboard' | 'canvas' | 'navigation' | 'studio';
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'default' | 'success' | 'info' | 'warning';
}
