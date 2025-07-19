// framework/component.js

import { createElement, h } from "./h.js";

export class WebMVCComponent {
  constructor(props = {}) {
    this.props = props;
    this.model = props.model;
    this.childComponents = [];
    this.refs = {};
  }

  // Render method - to be overridden by subclasses
  // Should return JSX directly (not wrapped in renderWithRefs)
  render() {
    throw new Error("render() method must be implemented");
  }

  createDom(parentEl) {
    const vdom = this.render(); // Virtual DOM node from JSX -> h() -> actual element
    console.log(`${this.constructor.name} createDom() vdom:`, vdom);

    const dom = createElement(vdom, parentEl);
    this.el = dom; // Track own root DOM element
    this.parentEl = parentEl;

    console.log(`${this.constructor.name} createDom():`, dom.outerHTML);

    return dom;
  }

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

  mount(container) {
    console.log("🚀 Mounting component:", this.constructor.name);

    // Set up ref context and component tracking
    h.currentComponent = this;
    h.currentRefContext = this.refs;

    const dom = this.createDom(container);

    h.currentComponent = null;

    container.replaceChildren(dom);

    // Collect all refs after mounting
    this.allRefs = this.collectAllRefs();

    // Call afterMount on all components
    this.callAfterMount();

    console.log(`${this.constructor.name} mount() el=`, this.el);
    return this;
  }

  callAfterMount() {
    if (typeof this.afterMount === "function") {
      this.afterMount();
    }
    this.childComponents.forEach((child) => child.callAfterMount());
  }

  unmount() {
    if (this.componentId) {
      globalRefRegistry.delete(this.componentId);
    }

    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }

  // Update method called by the model listener
  // This is where the component should re-render based on model changes
  update(property, newValue, oldValue) {
    console.log(`${this.constructor.name} update() called - ${property}, new: ${newValue}, old: ${oldValue}`);

    if (!this.el || !this.parentEl) {
      return;
    }
    console.log(`${this.constructor.name} update() el:`, this.el.outerHTML);

    const oldEl = this.el;
    const dom = this.createDom(this.parentEl);
    this.parentEl.replaceChild(dom, oldEl);

    /*
    console.log(`${this.constructor.name} update() updated dom=`, this.el.outerHTML);

    if (this.el.parentNode) {
      console.log("Parent node with updated child:", this.el.parentNode.innerHTML);
    }
    */
  }

  getRef(refName) {
    const ref = this.allRefs?.[refName] || this.refs[refName];
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
