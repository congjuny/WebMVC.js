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

  createDom(argParentElement) {
    const vdom = this.render(); // Virtual DOM node from JSX -> h() -> actual element
    console.log(`${this.constructor.name} createDom() vdom:`, vdom);

    const dom = createElement(vdom, argParentElement);
    this.element = dom; // Track own root DOM element
    this.parentElement = argParentElement;

    //console.log(`${this.constructor.name} createDom() innerHTML:`, dom.innerHTML);

    return dom;
  }

  /*
  collectAllRefs() {
    console.log("🔍 collectAllRefs() called for:", this.constructor.name);
    const allRefs = { ...this.refs };

    // Recursively collect refs from child components
    this.childComponents.forEach((child) => {
      console.log("📦 Collecting refs from child:", child.constructor.name);
      const childRefs = child.collectAllRefs();
      Object.assign(allRefs, childRefs);
    });

    console.log("🏁 collectAllRefs() result for", this.constructor.name, ":", Object.keys(allRefs));
    return allRefs;
  }
  */

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
    console.log(`${this.constructor.name} update() called - ${changes}, model: ${model}`);

    if (!this.element || !this.parentElement) {
      return;
    }
    console.log(`${this.constructor.name} update() element:`, this.element.outerHTML);

    const oldEl = this.element;

    // Set up ref context and component tracking
    h.currentComponent = this;
    h.currentRefContext = this.refs;

    const dom = this.createDom(this.parentElement);

    h.currentComponent = null;

    this.parentElement.replaceChild(dom, oldEl);

    // Collect all refs after mounting
    // this.refs = this.collectAllRefs();

    /*
    console.log(`${this.constructor.name} update() updated dom=`, this.element.outerHTML);

    if (this.element.parentNode) {
      console.log("Parent node with updated child:", this.element.parentNode.innerHTML);
    }
    */
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
}
