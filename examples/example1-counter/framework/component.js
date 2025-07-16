

// framework/component.js

import { createElement } from './h.js';

export class Component {
  constructor(model) {
    this.model = model;
    if (model?.addListener) {
      model.addListener(() => this.update());
    }
  }

  createDom(parentEl) {
    const vdom = this.render(); // Virtual DOM node from JSX -> h() -> actual element
    const dom = createElement(vdom, parentEl);
    this.el = dom;             // Track own root DOM element
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

  update() {
    console.log(`${this.constructor.name} update() entering======>`);

    if (!this.el || !this.parentEl) {
      return;
    }
    console.log(`${this.constructor.name} update() el:`, this.el.outerHTML);

    const oldEl = this.el;
    const dom = this.createDom(this.parentEl);
    this.parentEl.replaceChild(dom, oldEl);

    console.log(`${this.constructor.name} update() updated dom=`, this.el.outerHTML);

    if(this.el.parentNode) {
      console.log('Parent node with updated child:', this.el.parentNode.innerHTML);
    }
  }
}
