/*!
 * Copyright (c) 2025 Congjun Yang
 * License: MIT
 *
 * WebMVC.js/src/model.js
 *
 * The WebMVCModel class provides a reactive data model for components
 */

export class WebMVCModel {
  constructor(data = {}) {
    // Internal properties (non-enumerable to avoid proxy traps)
    Object.defineProperties(this, {
      _listeners: { value: new Set(), writable: true },
      _propertyListeners: { value: new Map(), writable: true }, // Map<string, Set<Function>>
      _batchedChanges: { value: new Map(), writable: true },
      _batchTimeout: { value: null, writable: true },
      _batchDelay: { value: 0, writable: true }, // 0 = next tick, >0 = milliseconds
      _isInBatch: { value: false, writable: true },
      _path: { value: "", writable: true },
    });

    // Initialize with provided data
    Object.assign(this, data);

    // Return proxied version
    return this._createProxy(this);
  }

  // Create proxy with change detection
  _createProxy(target, path = "") {
    return new Proxy(target, {
      get(obj, prop) {
        const value = obj[prop];

        /* No recursive, at least for now
         ************************************************************************************
        // Return methods and internal properties as-is
        if (typeof value === "function" || typeof prop === "symbol" || prop.startsWith("_")) {
          return value;
        }

        // Wrap objects and arrays in proxies for nested monitoring
        if (value && typeof value === "object") {
          const fullPath = path ? `${path}.${prop}` : prop;

          if (Array.isArray(value)) {
            if (obj._createArrayProxy) {
              return obj._createArrayProxy(value, fullPath);
            } else {
              return value;
            }
          } else if (value.constructor === Object) {
            if (obj._createProxy) {
              return obj._createProxy(value, fullPath);
            } else {
              return value;
            }
          }
        }
        */

        return value;
      },

      set(obj, prop, newValue) {
        // Skip internal properties
        if (prop.startsWith("_")) {
          obj[prop] = newValue;
          return true;
        }

        const oldValue = obj[prop];
        const fullPath = path ? `${path}.${prop}` : prop;

        // Only proceed if value actually changed
        if (oldValue !== newValue) {
          obj[prop] = newValue;

          // Record the change
          obj._recordChange(fullPath, oldValue, newValue);
        }

        return true;
      },

      deleteProperty(obj, prop) {
        if (prop.startsWith("_")) {
          delete obj[prop];
          return true;
        }

        const oldValue = obj[prop];
        const fullPath = path ? `${path}.${prop}` : prop;

        if (oldValue !== undefined) {
          delete obj[prop];
          obj._recordChange(fullPath, oldValue, undefined);
        }

        return true;
      },
    });
  }

  // Create array proxy with enhanced array method monitoring
  _createArrayProxy(array, path) {
    const self = this;

    return new Proxy(array, {
      get(arr, prop) {
        // Handle array methods that modify the array
        if (typeof arr[prop] === "function") {
          const originalMethod = arr[prop];

          // Methods that modify the array
          if (["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].includes(prop)) {
            return function (...args) {
              const oldArray = [...arr];
              const result = originalMethod.apply(arr, args);

              // Record array change
              self._recordChange(path, oldArray, [...arr]);

              return result;
            };
          }
        }

        const value = arr[prop];

        /* No recursive, at least for now
         ************************************************************************************
        // Wrap nested objects/arrays
        if (value && typeof value === "object") {
          const fullPath = `${path}[${prop}]`;

          if (Array.isArray(value)) {
            return self._createArrayProxy(value, fullPath);
          } else if (value.constructor === Object) {
            return self._createProxy(value, fullPath);
          }
        }
        */

        return value;
      },

      set(arr, prop, newValue) {
        // Handle array index assignments
        if (!isNaN(prop)) {
          const oldValue = arr[prop];
          const fullPath = `${path}[${prop}]`;

          if (oldValue !== newValue) {
            arr[prop] = newValue;
            self._recordChange(fullPath, oldValue, newValue);
          }
        } else {
          arr[prop] = newValue;
        }

        return true;
      },
    });
  }

  // Record a change for batching
  _recordChange(path, oldValue, newValue) {
    this._batchedChanges.set(path, {
      path,
      oldValue,
      newValue,
      timestamp: Date.now(),
    });

    this._scheduleBatchFlush();
  }

  // Schedule batch processing
  _scheduleBatchFlush() {
    if (this._batchTimeout) return;

    const flushChanges = () => {
      if (this._batchedChanges.size > 0) {
        const changes = Array.from(this._batchedChanges.values());
        this._batchedChanges.clear();

        this._isInBatch = true;
        this._notifyListeners(changes);
        this._isInBatch = false;
      }
      this._batchTimeout = null;
    };

    if (this._batchDelay === 0) {
      // Use next tick for immediate batching
      this._batchTimeout = setTimeout(flushChanges, 0);
    } else {
      // Use specified delay
      this._batchTimeout = setTimeout(flushChanges, this._batchDelay);
    }
  }

  // Notify all listeners
  _notifyListeners(changes) {
    // Notify global listeners
    this._listeners.forEach((listener) => {
      try {
        // append the listener to the Macrotask queue
        setTimeout(listener(changes, this), 0);
      } catch (error) {
        console.error("Error in change listener:", error);
      }
    });

    // Notify property-specific listeners
    if (this._propertyListeners.size > 0) {
      this._notifyPropertyListeners(changes);
    }
  }

  // Notify property-specific listeners
  _notifyPropertyListeners(changes) {
    changes.forEach((change) => {
      this._propertyListeners.forEach((listeners, pattern) => {
        if (this._matchesPattern(change.path, pattern)) {
          listeners.forEach((listener) => {
            try {
              // append the listener to the Macrotask queue
              setTimeout(listener(changes, this), 0);
            } catch (error) {
              console.error("Error in property listener:", error);
            }
          });
        }
      });
    });
  }

  // Check if a path matches a pattern (supports wildcards)
  _matchesPattern(path, pattern) {
    // Exact match
    if (path === pattern) return true;

    // Convert pattern to regex
    // Support for wildcards: * (any chars), ** (any depth), ? (single char)
    const regexPattern = pattern
      .replace(/\./g, "\\.") // Escape dots
      .replace(/\[/g, "\\[") // Escape brackets
      .replace(/\]/g, "\\]") // Escape brackets
      .replace(/\*\*/g, "___DOUBLE___") // Temporarily replace **
      .replace(/\*/g, "[^.\\[\\]]*") // * matches any chars except separators
      .replace(/___DOUBLE___/g, ".*") // ** matches everything including separators
      .replace(/\?/g, "[^.\\[\\]]"); // ? matches single char except separators

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(path);
  }

  // Public API methods

  // Add a change listener
  addListener(callback) {
    if (typeof callback !== "function") {
      throw new Error("Listener must be a function");
    }
    this._listeners.add(callback);

    // Return unsubscribe function
    return () => this._listeners.delete(callback);
  }

  // Add a property-specific listener
  // Supports wildcards: *, **, ?
  // Examples: 'name', 'preferences.*', 'users[*].name', 'items.**.status'
  addPropertyListener(propertyPattern, callback) {
    if (typeof callback !== "function") {
      throw new Error("Listener must be a function");
    }

    if (!this._propertyListeners.has(propertyPattern)) {
      this._propertyListeners.set(propertyPattern, new Set());
    }

    this._propertyListeners.get(propertyPattern).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this._propertyListeners.get(propertyPattern);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this._propertyListeners.delete(propertyPattern);
        }
      }
    };
  }

  // Remove a listener
  removeListener(callback) {
    return this._listeners.delete(callback);
  }

  // Remove a property listener
  removePropertyListener(propertyPattern, callback) {
    const listeners = this._propertyListeners.get(propertyPattern);
    if (listeners) {
      const removed = listeners.delete(callback);
      if (listeners.size === 0) {
        this._propertyListeners.delete(propertyPattern);
      }
      return removed;
    }
    return false;
  }

  // Remove all listeners for a property pattern
  removeAllPropertyListeners(propertyPattern) {
    return this._propertyListeners.delete(propertyPattern);
  }

  // Remove all listeners
  clearListeners() {
    this._listeners.clear();
    this._propertyListeners.clear();
  }

  // Get current listener count
  getListenerCount() {
    return this._listeners.size;
  }

  // Get property listener count
  getPropertyListenerCount(propertyPattern = null) {
    if (propertyPattern) {
      const listeners = this._propertyListeners.get(propertyPattern);
      return listeners ? listeners.size : 0;
    }

    let total = 0;
    this._propertyListeners.forEach((listeners) => {
      total += listeners.size;
    });
    return total;
  }

  // Get all property patterns that have listeners
  getPropertyPatterns() {
    return Array.from(this._propertyListeners.keys());
  }

  // Set batch delay (0 = next tick, >0 = milliseconds)
  setBatchDelay(delay) {
    this._batchDelay = Math.max(0, delay);
  }

  // Force flush pending changes immediately
  flushChanges() {
    if (this._batchTimeout) {
      clearTimeout(this._batchTimeout);
      this._batchTimeout = null;
    }

    if (this._batchedChanges.size > 0) {
      const changes = Array.from(this._batchedChanges.values());
      this._batchedChanges.clear();
      this._notifyListeners(changes);
    }
  }

  // Check if currently in a batch update
  isInBatch() {
    return this._isInBatch;
  }

  // Perform multiple changes in a single batch
  batchUpdate(updateFn) {
    const wasInBatch = this._isInBatch;
    this._isInBatch = true;

    try {
      updateFn(this);
    } finally {
      this._isInBatch = wasInBatch;
      if (!wasInBatch) {
        this.flushChanges();
      }
    }
  }

  // Convert to plain object (useful for serialization)
  toPlainObject() {
    const result = {};

    for (const key in this) {
      if (!key.startsWith("_")) {
        const value = this[key];
        if (value && typeof value === "object") {
          if (Array.isArray(value)) {
            result[key] = value.map((item) =>
              item && typeof item === "object" && item.toPlainObject ? item.toPlainObject() : item
            );
          } else if (value.toPlainObject) {
            result[key] = value.toPlainObject();
          } else {
            result[key] = { ...value };
          }
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }
}

// Collection class for managing arrays of models
export class WebMVCCollection extends WebMVCModel {
  constructor(ModelClass, initialData = []) {
    super();

    // Store the model class for creating new instances
    Object.defineProperty(this, "_ModelClass", {
      value: ModelClass,
      writable: false,
    });

    // Initialize with array of model instances
    this.items = initialData.map((data) => (data instanceof ModelClass ? data : new ModelClass(data)));

    // Set up cascading listeners for individual model changes
    this._setupModelListeners();
  }

  // Set up listeners for individual model changes
  _setupModelListeners() {
    this.items.forEach((model, index) => {
      if (model instanceof WebMVCModel) {
        model.addListener((changes) => {
          // Re-emit changes with collection context
          const collectionChanges = changes.map((change) => ({
            ...change,
            path: `items[${index}].${change.path}`,
            collectionIndex: index,
            model: model,
          }));
          this._recordCollectionChange("model_update", collectionChanges);
        });
      }
    });
  }

  // Record collection-level changes
  _recordCollectionChange(type, data) {
    this._recordChange(`collection.${type}`, null, {
      type,
      data,
      timestamp: Date.now(),
    });
  }

  // Override array proxy to handle model instances
  _createArrayProxy(array, path) {
    const self = this;

    return new Proxy(array, {
      get(arr, prop) {
        if (typeof arr[prop] === "function") {
          const originalMethod = arr[prop];

          if (["push", "pop", "shift", "unshift", "splice"].includes(prop)) {
            return function (...args) {
              const oldLength = arr.length;
              const result = originalMethod.apply(arr, args);

              // Set up listeners for newly added models
              if (["push", "unshift", "splice"].includes(prop)) {
                self._setupModelListeners();
              }

              self._recordChange(path, oldLength, arr.length);
              self._recordCollectionChange(`array_${prop}`, {
                method: prop,
                args: args,
                oldLength,
                newLength: arr.length,
              });

              return result;
            };
          }
        }

        return arr[prop];
      },

      set(arr, prop, newValue) {
        if (!isNaN(prop)) {
          const oldValue = arr[prop];

          // Convert plain objects to model instances
          if (newValue && typeof newValue === "object" && !(newValue instanceof self._ModelClass)) {
            newValue = new self._ModelClass(newValue);
          }

          arr[prop] = newValue;

          // Set up listener for new model
          if (newValue instanceof ObservableDataModel) {
            newValue.addListener((changes) => {
              const collectionChanges = changes.map((change) => ({
                ...change,
                path: `items[${prop}].${change.path}`,
                collectionIndex: parseInt(prop),
                model: newValue,
              }));
              self._recordCollectionChange("model_update", collectionChanges);
            });
          }

          self._recordChange(`${path}[${prop}]`, oldValue, newValue);
        } else {
          arr[prop] = newValue;
        }

        return true;
      },
    });
  }

  // Collection-specific methods
  add(data) {
    const model = data instanceof this._ModelClass ? data : new this._ModelClass(data);
    this.items.push(model);
    return model;
  }

  remove(predicate) {
    const index = typeof predicate === "function" ? this.items.findIndex(predicate) : this.items.indexOf(predicate);

    if (index > -1) {
      return this.items.splice(index, 1)[0];
    }
    return null;
  }

  findById(id) {
    return this.items.find((item) => item.id === id);
  }

  findBy(predicate) {
    return this.items.find(predicate);
  }

  filterBy(predicate) {
    return this.items.filter(predicate);
  }

  update(id, data) {
    const model = this.findById(id);
    if (model) {
      model.batchUpdate((m) => Object.assign(m, data));
      return model;
    }
    return null;
  }

  clear() {
    this.items.length = 0;
  }

  get length() {
    return this.items.length;
  }

  // Array-like methods
  /////////////////////////////////////////////////////////////////////////////

  // Map over the items - returns a new array (not a collection)
  map(callback, thisArg) {
    return this.items.map(callback, thisArg);
  }

  // Filter items - returns a new array (not a collection)
  filter(callback, thisArg) {
    return this.items.filter(callback, thisArg);
  }

  // Reduce the items
  reduce(callback, initialValue) {
    return arguments.length >= 2 ? this.items.reduce(callback, initialValue) : this.items.reduce(callback);
  }

  // Find first item matching predicate
  find(callback, thisArg) {
    return this.items.find(callback, thisArg);
  }

  // Find index of first item matching predicate
  findIndex(callback, thisArg) {
    return this.items.findIndex(callback, thisArg);
  }

  // Check if some items match predicate
  some(callback, thisArg) {
    return this.items.some(callback, thisArg);
  }

  // Check if all items match predicate
  every(callback, thisArg) {
    return this.items.every(callback, thisArg);
  }

  // Execute function for each item
  forEach(callback, thisArg) {
    return this.items.forEach(callback, thisArg);
  }

  // Get item at index
  at(index) {
    return this.items.at ? this.items.at(index) : this.items[index];
  }

  // Get first item
  first() {
    return this.items[0];
  }

  // Get last item
  last() {
    return this.items[this.items.length - 1];
  }

  // Check if collection includes an item
  includes(item) {
    return this.items.includes(item);
  }

  // Get index of item
  indexOf(item) {
    return this.items.indexOf(item);
  }

  // Create a new collection with filtered items
  createFiltered(predicate) {
    const filteredItems = this.items.filter(predicate);
    return new ObservableCollection(this._ModelClass, filteredItems);
  }

  // Create a new collection with sorted items
  createSorted(compareFn) {
    const sortedItems = [...this.items].sort(compareFn);
    return new ObservableCollection(this._ModelClass, sortedItems);
  }

  // Sort the current collection (modifies original)
  sort(compareFn) {
    this.items.sort(compareFn);
    return this;
  }

  // Reverse the current collection (modifies original)
  reverse() {
    this.items.reverse();
    return this;
  }

  // Get a slice of items (returns new array, not collection)
  slice(start, end) {
    return this.items.slice(start, end);
  }

  // Make collection iterable
  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }

  // Convert to plain array
  toArray() {
    return this.items.map((item) => (item.toPlainObject ? item.toPlainObject() : item));
  }
}
