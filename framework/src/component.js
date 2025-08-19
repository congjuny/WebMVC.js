// Copyright (c) 2025 Congjun Yang
// framework/component.js

import { Fragment, h } from "./h.js";
import { getLogger, LogLevel } from "./logger.js";

const log = getLogger();
log.setLogLevel(LogLevel.DEBUG);
let creatingNewElement = false;

export class WebMVCComponent {
  constructor(props = {}) {
    this.props = props;
    this.model = props.model;
    this.componentId = props.id || null; // optional id for the component
    this.parentComponent = null; // Track parent component
    this.childComponents = new Map(); // Track child components
    this.refs = new Map(); // references to child DOM elements
    this.element = null; // Track own root DOM element
    this.parentElement = null; // parent element
  }

  // Render method - to be overridden by subclasses
  render() {
    throw new Error("render() method must be implemented");
  }

  createDom(argOwnerComponent, argParentElement) {
    const vdom = this.render(); // Virtual DOM node from JSX -> h()
    log.debug("createDom() vdom:", vdom);

    const dom = createElement(vdom, argOwnerComponent, argParentElement);

    this.element = dom; // Track own root DOM element
    this.parentElement = argParentElement;

    //log.debug('createDom() innerHTML:', dom.innerHTML);

    return dom;
  }

  mount(container) {
    log.debug("Mounting component:", this.constructor.name);

    creatingNewElement = true;
    this.createDom(this, container);
    creatingNewElement = false;

    container.replaceChildren(this.element);

    // Call afterMount on all components
    this.callAfterMount();

    //log.debug(`${this.constructor.name} mount() element=`, this.element);
    logComponent(this);

    return this;
  }

  callAfterMount() {
    if (typeof this.afterMount === "function") {
      this.afterMount();
    }

    for (const [key, value] of this.childComponents) {
      value.callAfterMount();
    }
  }

  unmount() {
    this.refs = new Map();
    this.childComponents = new Map();

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  // Update method called by the model listener
  // This is where the component should re-render based on model changes
  update(changes, model) {
    log.debug(`${this.constructor.name} update() called - ${changes}, model: ${model}`);

    if (!this.element || !this.parentElement) {
      return;
    }

    log.debug(`${this.constructor.name} update() element:`, this.element.innerHTML);

    const oldEl = this.element;

    // complete replace or merge.
    // const dom = this.createDom(this.parentElement);
    // this.parentElement.replaceChild(dom, oldEl);

    const vdom = this.render(); // Virtual DOM node from JSX -> h() -> actual element
    const dom2 = createElement(vdom, this, this.parentElement);
    mergeDOMElements(this, oldEl, dom2);

    log.debug("Old Element: ", oldEl.innerHTML);
  }
}

////////////////////////////////////////////////////////////////////////////////////
// Helper functions
////////////////////////////////////////////////////////////////////////////////////
const svgTags = new Set([
  "svg",
  "circle",
  "rect",
  "line",
  "path",
  "ellipse",
  "polygon",
  "polyline",
  "text",
  "g",
  "defs",
  "use",
  "foreignObject",
]);

function createElement(vnode, ownerComponent, parentElement = null) {
  if (vnode == null || vnode === false) return null;

  // Text nodes (string or number)
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  const { tag, props, children } = vnode;

  if (tag === Fragment) {
    const frag = document.createDocumentFragment();
    for (const child of children) {
      const node = createElement(child, ownerComponent, frag);
      if (node) frag.appendChild(node);
    }
    return frag;
  }

  if (typeof tag === "function") {
    const instance = new tag({ ...props, children: children });

    instance.parentComponent = ownerComponent;
    if (props.id) {
      instance.componentId = props.id;
      if (instance.parentComponent) {
        if (creatingNewElement && instance.parentComponent.childComponents[props.id]) {
          log.warn(`Component ID ${props.id} already exists in ${instance.parentComponent.constructor.name}, overwriting`);
        }

        // store this child component in the parent component
        instance.parentComponent.childComponents[props.id] = instance;
      }
    }

    const dom = instance.createDom(instance, parentElement);
    dom.__ownerComponent = instance;

    return dom;
  }

  // create regular HTML element
  let el = null;
  if (svgTags.has(tag) || (parentElement && parentElement.__namespace === "svg")) {
    el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    el.__namespace = "svg";
  } else {
    el = document.createElement(tag);
  }

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === "ref") {
        if (typeof value === "string") {
          el.__ref = value;

          // store ref in the owner component
          //if (ownerComponent && !ownerComponent.refs[value]) {
          if (ownerComponent) {
            if (creatingNewElement && ownerComponent.refs[value]) {
              log.warn(`Ref ${value} already exists in ${ownerComponent.constructor.name}, overwriting`);
            }
            ownerComponent.refs[value] = el;
            log.debug(`storing ref ${value} in ${ownerComponent.constructor.name}`);
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
    const node = createElement(child, ownerComponent, el);
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

function logComponent(component) {
  log.debug(`logComponent - ${component.constructor.name} refs:`, component.refs);
  log.debug(`logComponent - ${component.constructor.name} children:`, component.childComponents);

  for (const [key, value] of Object.entries(component.childComponents)) {
    log.debug(`Child component [${key}]:`, value);
    logComponent(value);
  }
}

function mergeDOMElements(ownerComponent, target, source) {
  if (!target || !source) {
    log.debug("Error: Invalid target or source element");
    return;
  }

  // Step 1: Merge attributes
  mergeAttributes(ownerComponent, target, source);

  // Step 2: Merge children
  mergeChildren(ownerComponent, target, source);
}

function mergeAttributes(ownerComponent, target, source) {
  if (!target || !source || target.nodeType !== Node.ELEMENT_NODE || source.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  if (target.__ref && ownerComponent) {
    ownerComponent.refs[target.__ref] = target;
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

function mergeChildren(ownerComponent, target, source) {
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
      addRefsFromSubtree(sourceChild, ownerComponent);
      target.appendChild(sourceChild);

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
        log.debug(`Merging ${ownerComponent.constructor.name} ${targetChild.tagName} element`);
        if (targetChild.__ownerComponent) {
          // this child node belong to a child component of the current owner component
          // record this child component with the current owner
          if (targetChild.__ownerComponent.componentId) {
            ownerComponent.childComponents[targetChild.__ownerComponent.componentId] = targetChild.__ownerComponent;
          }
          mergeDOMElements(targetChild.__ownerComponent, targetChild, sourceChild);
        } else {
          mergeDOMElements(ownerComponent, targetChild, sourceChild);
        }
        targetIndex++;
        sourceIndex++;
      } else {
        // Replace target child with source child
        removeRefsFromSubtree(targetChild, ownerComponent);
        addRefsFromSubtree(sourceChild, ownerComponent);
        target.replaceChild(sourceChild, targetChild);
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
        removeRefsFromSubtree(childToRemove, ownerComponent);
        target.removeChild(childToRemove);
        log.debug(`Removed ${childToRemove.nodeType === 1 ? childToRemove.tagName : "text"} node`);
      }
      targetIndex++;
    }
  }
}

function canMergeNodes(targetNode, sourceNode) {
  if (targetNode.nodeType !== sourceNode.nodeType) {
    return false;
  }

  if (targetNode.nodeType === Node.ELEMENT_NODE) {
    return targetNode.tagName.toLowerCase() === sourceNode.tagName.toLowerCase();
  }

  return true; // For text nodes, we can always merge
}

function removeRefsFromSubtree(element, component) {
  if (!element || !component) {
    return;
  }

  log.debug(`removeRefsFromSubtree() element:`, element);

  if (element.__ref && component.refs[element.__ref]) {
    delete component.refs[element.__ref];
    log.debug(`Removed ref ${element.__ref} from component ${component.constructor.name}`);
  }

  for (let child of element.children || []) {
    if (child.__ownerComponent && child.__ownerComponent !== component) {
      // child belongs to a descendent component, do not touch it
      continue;
    }
    removeRefsFromSubtree(child, component);
  }
}

function addRefsFromSubtree(element, component) {
  if (!element || !component) {
    return;
  }

  if (element.__ref) {
    component.refs[element.__ref] = element;
    log.debug(`Added ref ${element.__ref} to component ${component.constructor.name}`);
  }

  for (let child of element.children || []) {
    if (child.__ownerComponent && child.__ownerComponent !== component) {
      // child belongs to a descendent component, do not touch it
      continue;
    }
    addRefsFromSubtree(child, component);
  }
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
