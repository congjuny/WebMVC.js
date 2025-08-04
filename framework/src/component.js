// Copyright (c) 2025 Congjun Yang
// framework/component.js

import { createElement, h } from "./h.js";

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

  createDom(argParentElement, isAttach = true) {
    const vdom = this.render(); // Virtual DOM node from JSX -> h() -> actual element
    console.log(`${this.constructor.name} createDom() vdom:`, vdom);

    const dom = createElement(vdom, argParentElement);

    if (isAttach) {
      this.element = dom; // Track own root DOM element
      this.parentElement = argParentElement;
    }

    //console.log(`${this.constructor.name} createDom() innerHTML:`, dom.innerHTML);

    return dom;
  }

  mount(container) {
    console.log("🚀 Mounting component:", this.constructor.name);

    // Set up ref context and component tracking
    h.currentComponent = this;
    h.currentRefContext = this.refs;

    const dom = this.createDom(container);

    h.currentComponent = null;

    container.replaceChildren(dom);

    // Collect all refs after mounting
    // this.refs = this.collectAllRefs();

    // Call afterMount on all components
    this.callAfterMount();

    console.log(`${this.constructor.name} mount() element=`, this.element);
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
    console.log(`${this.constructor.name} update() element:`, this.element.innerHTML);

    const oldEl = this.element;

    // Set up ref context and component tracking
    h.currentComponent = this;
    h.currentRefContext = this.refs;

    // complete replace or merge.
    // TO DO: check refs handling with merge approach
    //const dom = this.createDom(this.parentElement);
    const dom2 = this.createDom(this.parentElement, false);

    h.currentComponent = null;

    //this.parentElement.replaceChild(dom, oldEl);
    this.mergeDOMElements(oldEl, dom2);
    console.log(`${this.constructor.name} update() merged element:`, oldEl.innerHTML);
  }

  getRef(refName) {
    //const ref = this.allRefs?.[refName] || this.refs[refName];
    const ref = this.refs[refName];
    console.log("🔍 getRef(" + refName + "):", ref ? "found" : "not found");
    return ref;
  }

  // Update a ref value anywhere in the component tree
  updateRef(refName, value) {
    const element = this.getRef(refName);
    if (element && "value" in element) {
      element.value = value;
    }
    return element;
  }

  mergeDOMElements(target, source) {
    if (!target || !source) {
      this.logChange("Error: Invalid target or source element");
      return;
    }

    // Step 1: Merge attributes
    this.mergeAttributes(target, source);

    // Step 2: Merge children
    this.mergeChildren(target, source);
  }

  mergeAttributes(target, source) {
    if (!target || !source || target.nodeType !== Node.ELEMENT_NODE || source.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    // Copy all attributes from source to target
    for (let attr of source.attributes) {
      if (target.getAttribute(attr.name) !== attr.value) {
        this.logChange(`Updated attribute: ${attr.name} = "${attr.value}"`);
        target.setAttribute(attr.name, attr.value);
      }
    }

    // Remove attributes that don't exist in source (except id and class for demo)
    for (let attr of [...target.attributes]) {
      if (attr.name !== "id" && attr.name !== "class" && !source.hasAttribute(attr.name)) {
        this.logChange(`Removed attribute: ${attr.name}`);
        target.removeAttribute(attr.name);
      }
    }
  }

  mergeChildren(target, source) {
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
        //this.installEventHandlers(cloned);

        this.logChange(`Added new ${sourceChild.nodeType === 1 ? sourceChild.tagName : "text"} node`);
        sourceIndex++;
        continue;
      }

      const targetChild = targetChildren[targetIndex];

      // Check if nodes can be merged (same type and tag)
      if (this.canMergeNodes(targetChild, sourceChild)) {
        if (targetChild.nodeType === Node.TEXT_NODE) {
          // Merge text content
          if (targetChild.textContent.trim() !== sourceChild.textContent.trim()) {
            this.logChange(`Updated text: "${targetChild.textContent.trim()}" → "${sourceChild.textContent.trim()}"`);
            targetChild.textContent = sourceChild.textContent;
          }
        } else if (targetChild.nodeType === Node.ELEMENT_NODE) {
          // Recursively merge element
          this.logChange(`Merging ${targetChild.tagName} element`);
          this.mergeDOMElements(targetChild, sourceChild);
        }
        targetIndex++;
        sourceIndex++;
      } else {
        // Replace target child with source child
        const cloned = sourceChild.cloneNode(true);
        target.replaceChild(cloned, targetChild);
        this.logChange(
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
        this.logChange(`Removed ${childToRemove.nodeType === 1 ? childToRemove.tagName : "text"} node`);
      }
      targetIndex++;
    }
  }

  canMergeNodes(targetNode, sourceNode) {
    if (targetNode.nodeType !== sourceNode.nodeType) return false;

    if (targetNode.nodeType === Node.ELEMENT_NODE) {
      return targetNode.tagName.toLowerCase() === sourceNode.tagName.toLowerCase();
    }

    return true; // For text nodes, we can always merge
  }

  logChange(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  }

  installEventHandlers(element) {
    const pairs = JSON.parse(element.dataset?.events || "[]");
    pairs.forEach(([eventType, handlerName]) => {
      //const handler = eval(handlerName);
      console.log(`Installing event handler for ${eventType} on ${this.constructor.name}:`, handlerName);

      let handler = new Function(`return ${handlerName}`)();

      if (typeof handler === "function") {
        element.addEventListener(eventType, handler);
        console.log(`Installed event handler for ${eventType} on ${this.constructor.name}`);
      } else {
        console.warn(`Handler ${handlerName} not found on ${this.constructor.name}`);
      }
    });

    if (!element.children) {
      // No children to install handlers for
      return;
    }

    // recursively install handlers for child elements
    for (const child of element.children) {
      this.installEventHandlers(child);
    }
  }
}
