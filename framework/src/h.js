// Copyright (c) 2025 Congjun Yang
// framework/src/h.js

export function h(tag, props, ...children) {
  //console.log("h() called with tag:", tag, "props:", props, "children:", children);

  return { tag, props: props || {}, children };
}

export function createElement(vnode, parentElement = null) {
  if (vnode == null || vnode === false) return null;

  // Text nodes (string or number)
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  const { tag, props, children } = vnode;

  if (tag === Fragment) {
    const frag = document.createDocumentFragment();
    for (const child of children) {
      const node = createElement(child, frag);
      if (node) frag.appendChild(node);
    }
    return frag;
  }

  if (typeof tag === "function") {
    const instance = new tag({ ...props, children: children });

    // Track parent-child relationship
    if (h.currentComponent) {
      if (!h.currentComponent.childComponents) {
        h.currentComponent.childComponents = [];
      }
      //h.currentComponent.childComponents.push(instance);
      if (props.id) {
        h.currentComponent.childComponents[props.id] = instance;
      }

      instance.parent = h.currentComponent;
    }

    // Set component as current and render
    const previousComponent = h.currentComponent;
    h.currentComponent = instance;

    const dom = instance.createDom(parentElement);

    h.currentComponent = previousComponent;

    return dom;
  }

  const el = document.createElement(tag);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === "ref") {
        if (typeof value === "string" && h.currentComponent) {
          // store ref in the current component
          h.currentComponent.refs[value] = el;
          console.log(`Stored ref ${value} in ${h.currentComponent.constructor.name}`);
        }
      } else if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, value);
      } else if (value !== null && value !== undefined) {
        el.setAttribute(key, value);
      }
    });
  }

  for (const child of normalizeChildren(children)) {
    const node = createElement(child, el);
    if (node) {
      el.appendChild(node);
    }
  }

  return el;
}

function normalizeChildren(children) {
  if (children == null || children === false) {
    return [];
  }

  // Flatten arbitrarily nested arrays but preserve child structure
  const out = [];

  function recurse(c) {
    if (Array.isArray(c)) {
      for (const i of c) recurse(i);
    } else {
      out.push(c);
    }
  }

  recurse(children);
  return out;
}

export const Fragment = Symbol("Fragment");
