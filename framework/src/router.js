// Copyright (c) 2025 Congjun Yang
// framework/src/router.js

export class WebMVCRouter {
  constructor({ rootEl, basePath = "" } = {}) {
    this.routes = [];
    this.basePath = basePath;
    this.currentPath = window.location.pathname;
    this.container = rootEl;
    this.currentComponent = null;

    this.callbacks = {
      onBeforeRoute: null,
      onRouteStart: null,
      onRouteComplete: null,
      onRouteError: null,
      onRouteNotFound: null,
    };
  }

  async init() {
    const modules = (await import("./routes.js")).modules;

    Object.keys(modules).forEach((path) => {
      let routePath = path
        .replace(/^.*\/pages\//, "/")
        .replace(/\/page\.jsx$/, "")
        .replace(/\[([^\]]+)\]/g, ":$1");

      this.routes.push({
        path: routePath,
        load: modules[path], // dynamic import function
      });
    });

    // Listen for browser back/forward
    window.addEventListener("popstate", () => {
      this.navigate(window.location.pathname, false);
    });
  }

  setCallback(name, fn) {
    if (this.callbacks.hasOwnProperty(name)) {
      this.callbacks[name] = fn;
    }
  }

  // Support dynamic routes like /user/:id
  matchRoute(urlPath) {
    for (const route of this.routes) {
      const params = {};
      const routeParts = route.path.split("/").filter(Boolean);
      const urlParts = urlPath.split("/").filter(Boolean);

      if (routeParts.length !== urlParts.length) {
        continue;
      }

      let matched = true;
      routeParts.forEach((part, i) => {
        if (part.startsWith(":")) {
          params[part.slice(1)] = urlParts[i];
        } else if (part !== urlParts[i]) {
          matched = false;
        }
      });

      if (matched) {
        return { route, params };
      }
    }

    return null;
  }

  async navigate(path, pushState = true) {
    console.log("Router.navigate() path:", path);

    if (pushState && path !== this.currentPath) {
      window.history.pushState({}, "", path);
    }

    this.currentPath = path;
    await this.render();
  }

  async preload(path) {
    const match = this.matchRoute(path);
    if (!match) {
      return;
    }

    // Trigger the dynamic import, but ignore the result
    match.route.load();
  }

  async render() {
    if (!this.container) {
      return;
    }

    if (this.callbacks.onBeforeRoute) {
      const shouldContinue = await this.hooks.onBeforeRoute(path, params);
      if (shouldContinue === false) {
        return;
      }
    }

    const match = this.matchRoute(this.currentPath);
    if (!match) {
      if (this.callbacks.onRouteNotFound) {
        this.callbacks.onRouteNotFound(path);
        return;
      }
    }

    // Unmount current component
    if (this.currentComponent) {
      this.currentComponent.unmount();
      this.currentComponent = null;
    }

    // Clear container
    this.container.innerHTML = "";

    if (match) {
      // before loading
      if (this.callbacks.onRouteStart) {
        this.callbacks.onRouteStart(path, params);
      }

      const module = await match.route.load();
      const ComponentClass = module.default;

      try {
        console.log("Router.render() component class:", ComponentClass);
        this.currentComponent = new ComponentClass(match.params);

        await this.currentComponent.mount(this.container);

        if (this.callbacks.onRouteComplete) {
          this.callbacks.onRouteComplete(path, params);
        }
      } catch (error) {
        if (this.callbacks.onRouteError) {
          this.callbacks.onRouteError(path, params, error);
        }
        throw new Error("Component mount() must return a DOM element");
      }
    } else {
      this.container.innerHTML = "<h1>404 - Page Not Found</h1>";
    }
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  // Cleanup method
  destroy() {
    if (this.currentComponent) {
      this.currentComponent.unmount();
    }
    window.removeEventListener("popstate", this.navigate);
  }
}
