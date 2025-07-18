// framework/component.js

import { createElement } from "./h.js";

export class WebMVCComponent {
  constructor(model) {
    this.model = model;
    if (model?.addListener) {
      model.addListener((property, newValue, oldValue) => this.update(property, newValue, oldValue));
    }
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

  mount(container) {
    //this.el = container;
    const dom = this.createDom(container);
    container.replaceChildren(dom);

    console.log(`${this.constructor.name} mount() el=`, this.el);
  }

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
}
