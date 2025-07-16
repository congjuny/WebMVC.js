
export class Model {
  #listeners = new Set();

  addListener(fn) {
    this.#listeners.add(fn);
  }

  removeListener(fn) {
    this.#listeners.delete(fn);
  }

  notify() {
    for (const fn of this.#listeners) fn();
  }

  // Auto-notify after mutation (you can call this manually too)
  set(prop, value) {
    this[prop] = value;
    this.notify();
  }
}

