/*!
 * Copyright (c) 2025 Congjun Yang
 * License: MIT
 *
 * WebMVC.js/src/h.js
 */

export function h(tag, props, ...children) {
  return { tag, props: props || {}, children };
}

export const Fragment = Symbol("Fragment");
