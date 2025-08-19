// Copyright (c) 2025 Congjun Yang
// framework/src/h.js

export function h(tag, props, ...children) {
  //console.log("h() called with tag:", tag, "props:", props, "children:", children);

  return { tag, props: props || {}, children };
}

export const Fragment = Symbol("Fragment");
