// Copyright (c) 2025 Congjun Yang
// framework/component.js

import { Fragment, h } from "./h.js";
import { getLogger, LogLevel } from "./logger.js";

const log = getLogger();
log.setLogLevel(LogLevel.DEBUG);

export class WebMVCComponent {
  constructor(props = {}) {
    this.props = props;
    this.model = props.model;
    this.childComponents = null; // Track child components
    this.refs = {}; // references to child DOM elements
    this.element = null; // Track own root DOM element
    this.parentElement = null; // parent element
  }

  // Render method - to be overridden by subclasses
  render() {
    throw new Error("render() method must be implemented");
  }

  createDom(argParentElement) {
    const vdom = this.render(); // Virtual DOM node from JSX -> h() -> actual element
    log.debug("createDom() vdom:", vdom);

    const dom = createElement(vdom, argParentElement);

    this.element = dom; // Track own root DOM element
    this.parentElement = argParentElement;

    //log.debug('createDom() innerHTML:', dom.innerHTML);

    return dom;
  }

  mount(container) {
    log.debug("🚀 Mounting component:", this.constructor.name);

    // Set up ref context and component tracking
    h.currentComponent = this;

    this.createDom(container);

    h.currentComponent = null;

    container.replaceChildren(this.element);

    // Call afterMount on all components
    this.callAfterMount();

    log.debug(`${this.constructor.name} mount() element=`, this.element);
    return this;
  }

  callAfterMount() {
    if (typeof this.afterMount === "function") {
      this.afterMount();
    }
    if (this.childComponents) {
      this.childComponents.forEach((child) => child.callAfterMount());
    }
  }

  unmount() {
    if (this.componentId) {
      globalRefRegistry.delete(this.componentId);
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  // Update method called by the model listener
  // This is where the component should re-render based on model changes
  update(changes, model) {
    //console.log(`${this.constructor.name} update() called - ${changes}, model: ${model}`);

    if (!this.element || !this.parentElement) {
      return;
    }
    log.debug(`${this.constructor.name} update() element:`, this.element.innerHTML);

    const oldEl = this.element;

    // Set up ref context and component tracking
    h.currentComponent = this;

    // complete replace or merge.
    // TO DO: check refs handling with merge approach
    //const dom = this.createDom(this.parentElement);
    //this.parentElement.replaceChild(dom, oldEl);

    const vdom = this.render(); // Virtual DOM node from JSX -> h() -> actual element
    const dom2 = createElement(vdom, this.parentElement);
    mergeDOMElements(oldEl, dom2);

    h.currentComponent = null;

    log.debug("Old Element: ", oldEl.innerHTML);
  }
}

////////////////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////////////////
function mergeDOMElements(target, source) {
  if (!target || !source) {
    log.debug("Error: Invalid target or source element");
    return;
  }

  // Step 1: Merge attributes
  mergeAttributes(target, source);

  // Step 2: Merge children
  mergeChildren(target, source);
}

function mergeAttributes(target, source) {
  if (!target || !source || target.nodeType !== Node.ELEMENT_NODE || source.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  // Copy all attributes from source to target
  for (let attr of source.attributes) {
    const value = source[attr.name];

    if (target.getAttribute(attr.name) !== attr.value) {
      log.debug(`Updated attribute: ${attr.name} = "${attr.value}"`);
      target.setAttribute(attr.name, attr.value);

      // TO DO: this is very rough - need to handle properties and attributes carefully
      if (value !== undefined) {
        // Merge objects for certain properties
        if (value && typeof value === "object") {
          // For style, merge properties
          if (attr.name === "style") {
            target.style.cssText = source.style.cssText;
          } else {
            // Generic merge for other object props if needed
            Object.assign(target[attr.name] || {}, value);
          }
        } else {
          target[attr.name] = value;
        }
      }
    }
  }
  //console.log("target after attribute merge: ", target.innerHTML);

  // Remove attributes that don't exist in source (except id and class for demo)
  for (let attr of [...target.attributes]) {
    if (attr.name !== "id" && attr.name !== "class" && !source.hasAttribute(attr.name)) {
      log.debug(`Removed attribute: ${attr.name}`);
      target.removeAttribute(attr.name);
    }
  }
}

function mergeChildren(target, source) {
  if (!target || !source) {
    return;
  }

  const targetChildren = [...target.childNodes];
  const sourceChildren = [...source.childNodes];

  let targetIndex = 0;
  let sourceIndex = 0;

  while (sourceIndex < sourceChildren.length) {
    const sourceChild = sourceChildren[sourceIndex];

    if (targetIndex >= targetChildren.length) {
      // Add remaining source children
      //const cloned = sourceChild.cloneNode(true);

      target.appendChild(sourceChild);
      //installEventHandlers(cloned);

      log.debug(`Added new ${sourceChild.nodeType === 1 ? sourceChild.tagName : "text"} node`);
      sourceIndex++;
      continue;
    }

    const targetChild = targetChildren[targetIndex];

    // Check if nodes can be merged (same type and tag)
    if (canMergeNodes(targetChild, sourceChild)) {
      if (targetChild.nodeType === Node.TEXT_NODE) {
        // Merge text content
        if (targetChild.textContent.trim() !== sourceChild.textContent.trim()) {
          log.debug(`Updated text: "${targetChild.textContent.trim()}" → "${sourceChild.textContent.trim()}"`);
          targetChild.textContent = sourceChild.textContent;
        }
      } else if (targetChild.nodeType === Node.ELEMENT_NODE) {
        // Recursively merge element
        log.debug(`Merging ${targetChild.tagName} element`);
        mergeDOMElements(targetChild, sourceChild);
      }
      targetIndex++;
      sourceIndex++;
    } else {
      // Replace target child with source child
      const cloned = sourceChild.cloneNode(true);
      target.replaceChild(cloned, targetChild);
      log.debug(
        `Replaced ${targetChild.nodeType === 1 ? targetChild.tagName : "text"} with ${
          sourceChild.nodeType === 1 ? sourceChild.tagName : "text"
        }`
      );
      targetIndex++;
      sourceIndex++;
    }
  }

  // Remove any remaining target children
  while (targetIndex < targetChildren.length) {
    const childToRemove = targetChildren[targetIndex];
    if (childToRemove && childToRemove.parentNode === target) {
      target.removeChild(childToRemove);
      log.debug(`Removed ${childToRemove.nodeType === 1 ? childToRemove.tagName : "text"} node`);
    }
    targetIndex++;
  }
}

function canMergeNodes(targetNode, sourceNode) {
  if (targetNode.nodeType !== sourceNode.nodeType) return false;

  if (targetNode.nodeType === Node.ELEMENT_NODE) {
    return targetNode.tagName.toLowerCase() === sourceNode.tagName.toLowerCase();
  }

  return true; // For text nodes, we can always merge
}

function installEventHandlers(element) {
  const pairs = JSON.parse(element.dataset?.events || "[]");
  pairs.forEach(([eventType, handlerName]) => {
    //const handler = eval(handlerName);
    log.debug(`Installing event handler for ${eventType} on ${element}:`, handlerName);

    let handler = new Function(`return ${handlerName}`)();

    if (typeof handler === "function") {
      element.addEventListener(eventType, handler);
      log.debug(`Installed event handler for ${eventType} on ${element}:`, handlerName);
    } else {
      log.warn(`Handler ${handlerName} not found on ${element}:`, handlerName);
    }
  });

  if (!element.children) {
    // No children to install handlers for
    return;
  }

  // recursively install handlers for child elements
  for (const child of element.children) {
    installEventHandlers(child);
  }
}

function createElement(vnode, parentElement = null) {
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
        if (!h.currentComponent.childComponents[props.id]) {
          h.currentComponent.childComponents[props.id] = instance;
        }
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
          if (!h.currentComponent.refs[value]) {
            h.currentComponent.refs[value] = el;
            console.log(`Stored ref ${value} in ${h.currentComponent.constructor.name}`);
          }
        }
      } else if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, value);
      } else if (value !== null && value !== undefined) {
        if (typeof value === "object") {
          // Handle object values (e.g., style) using {{}} syntax
          const str = Object.entries(value)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; ");
          el.setAttribute(key, str);
        } else {
          if (key === "className") {
            el.setAttribute("class", value);
          } else {
            el.setAttribute(key, value);
          }
        }
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
