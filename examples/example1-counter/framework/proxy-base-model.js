export class ProxyBaseModel {
  constructor() {
    this._listeners = new Set();
    this._bindings = new Map();

    // Return a proxy to intercept property access
    return new Proxy(this, {
      set: (target, property, value) => {
        const oldValue = target[property];

        // Set the new value
        target[property] = value;

        // Only notify if the value actually changed
        if (oldValue !== value) {
          this._notifyListeners(property, value, oldValue);
          this._updateBoundElements(property, value);
        }

        return true;
      },

      get: (target, property) => {
        return target[property];
      },
    });
  }

  /**
   * Add a change listener callback
   * @param {Function} callback - Function called when any property changes
   */
  addListener(callback) {
    this._listeners.add(callback);
  }

  /**
   * Remove a change listener callback
   * @param {Function} callback - The callback to remove
   */
  removeListener(callback) {
    this._listeners.delete(callback);
  }

  /**
   * Bind a property to a DOM element for two-way data binding
   * @param {string} property - The property name to bind
   * @param {HTMLElement} element - The DOM element to bind to
   * @param {string} eventType - The event type to listen for (default: 'input')
   */
  bindToElement(property, element, eventType = "input") {
    // Store the binding
    if (!this._bindings.has(property)) {
      this._bindings.set(property, new Set());
    }
    this._bindings.get(property).add({ element, eventType });

    // Set initial value from model to element
    this._updateElementValue(element, this[property]);

    // Listen for changes from the element
    const handler = (event) => {
      const newValue = this._getElementValue(element);
      this[property] = newValue;
    };

    element.addEventListener(eventType, handler);

    // Store the handler for cleanup
    element._bindingHandler = handler;

    return this;
  }

  /**
   * Unbind a property from a DOM element
   * @param {string} property - The property name to unbind
   * @param {HTMLElement} element - The DOM element to unbind from
   */
  unbindFromElement(property, element) {
    const bindings = this._bindings.get(property);
    if (bindings) {
      const binding = Array.from(bindings).find((b) => b.element === element);
      if (binding) {
        bindings.delete(binding);
        element.removeEventListener(binding.eventType, element._bindingHandler);
        delete element._bindingHandler;
      }
    }

    return this;
  }

  /**
   * Bind a property to a list container for rendering arrays
   * @param {string} property - The property name (should be an array)
   * @param {HTMLElement} container - The container element
   * @param {Function} renderItem - Function to render each item
   */
  bindToList(property, container, renderItem) {
    // Ensure the property is an array
    if (!Array.isArray(this[property])) {
      this[property] = [];
    }

    // Create a proxy for the array to intercept mutations
    const arrayProxy = new Proxy(this[property], {
      set: (target, index, value) => {
        target[index] = value;
        this._renderList(property, container, renderItem);
        this._notifyListeners(property, target);
        return true;
      },
    });

    // Override array methods to trigger updates
    const methodsToOverride = [
      "push",
      "pop",
      "shift",
      "unshift",
      "splice",
      "sort",
      "reverse",
    ];
    methodsToOverride.forEach((method) => {
      const originalMethod = arrayProxy[method];
      arrayProxy[method] = function (...args) {
        const result = originalMethod.apply(this, args);
        this._renderList(property, container, renderItem);
        this._notifyListeners(property, this);
        return result;
      }.bind(this);
    });

    // Replace the original array with the proxy
    this[property] = arrayProxy;

    // Store the binding
    this._bindings.set(property, { container, renderItem, type: "list" });

    // Initial render
    this._renderList(property, container, renderItem);

    return this;
  }

  /**
   * Notify all listeners of a property change
   * @private
   */
  _notifyListeners(property, newValue, oldValue) {
    this._listeners.forEach((callback) => {
      callback(property, newValue, oldValue);
    });
  }

  /**
   * Update bound DOM elements when a property changes
   * @private
   */
  _updateBoundElements(property, value) {
    const bindings = this._bindings.get(property);
    if (bindings) {
      if (bindings.type === "list") {
        // Handle list binding
        this._renderList(property, bindings.container, bindings.renderItem);
      } else {
        // Handle element bindings
        bindings.forEach((binding) => {
          this._updateElementValue(binding.element, value);
        });
      }
    }
  }

  /**
   * Update an element's value based on its type
   * @private
   */
  _updateElementValue(element, value) {
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }

  /**
   * Get an element's value based on its type
   * @private
   */
  _getElementValue(element) {
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      return element.value;
    } else {
      return element.textContent;
    }
  }

  /**
   * Render a list in the container
   * @private
   */
  _renderList(property, container, renderItem) {
    const items = this[property];
    container.innerHTML = "";

    items.forEach((item, index) => {
      const element = renderItem(item, index);
      container.appendChild(element);
    });
  }

  /**
   * Get the current state as a plain object
   */
  toJSON() {
    const result = {};
    for (const key in this) {
      if (!key.startsWith("_") && typeof this[key] !== "function") {
        result[key] = this[key];
      }
    }
    return result;
  }

  /**
   * Update multiple properties at once
   * @param {Object} data - Object containing property-value pairs
   */
  update(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });

    return this;
  }
}
