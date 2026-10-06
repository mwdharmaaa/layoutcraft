/**
 * @typedef {'clipboard' | 'canvas' | 'navigation' | 'studio'} ShortcutCategory
 *
 * @typedef {Object} ShortcutItem
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} keys
 * @property {ShortcutCategory} category
 *
 * @typedef {Object} ToastMessage
 * @property {string} id
 * @property {string} message
 * @property {'default' | 'success' | 'info' | 'warning'} [type]
 */

export const SHORTCUT_CATEGORIES = ['clipboard', 'canvas', 'navigation', 'studio'];
