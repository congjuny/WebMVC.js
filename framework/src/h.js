export function h(type, props, ...children) {
  console.log("h() called with type:", type, "props:", props, "children:", children);

  return { type, props: props || {}, children: children.flat() };
}

export function createElement(vnode, parentEl = null) {
  if (vnode == null || vnode === false) return null;

  // Text nodes (string or number)
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  const { type, props, children } = vnode;

  if (type === Fragment) {
    const frag = document.createDocumentFragment();
    for (const child of children) {
      const node = createElement(child, frag);
      if (node) frag.appendChild(node);
    }
    return frag;
  }

  if (typeof type === "function") {
    const instance = new type(props);
    return instance.createDom(parentEl);
  }

  const el = document.createElement(type);

  for (const [key, value] of Object.entries(props || {})) {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value);
    } else if (value != null) {
      el.setAttribute(key, value);
    }
  }

  for (const child of children) {
    const node = createElement(child, el);
    if (node) el.appendChild(node);
  }

  return el;
}

export const Fragment = Symbol("Fragment");
