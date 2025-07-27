// Copyright (c) 2025 Congjun Yang
// framework/src/router.js

export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = window.location.pathname;
    this.container = null;
    this.currentComponent = null;

    // Listen for browser back/forward
    window.addEventListener("popstate", () => {
      this.navigate(window.location.pathname, false);
    });

    // Intercept link clicks
    document.addEventListener("click", (e) => {
      if (e.target.tagName === "A" && e.target.getAttribute("href")?.startsWith("/")) {
        e.preventDefault();
        this.navigate(e.target.getAttribute("href"));
      }
    });
  }

  route(path, ComponentClass) {
    this.routes.set(path, ComponentClass);
    return this;
  }

  // Support dynamic routes like /user/:id
  matchRoute(path) {
    // Exact match first
    if (this.routes.has(path)) {
      return { ComponentClass: this.routes.get(path), params: {} };
    }

    // Dynamic route matching
    for (const [pattern, ComponentClass] of this.routes) {
      const regex = new RegExp("^" + pattern.replace(/:([^/]+)/g, "([^/]+)") + "$");
      const match = path.match(regex);

      if (match) {
        const paramNames = [...pattern.matchAll(/:([^/]+)/g)].map((m) => m[1]);
        const params = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });

        return { ComponentClass, params };
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

  async render() {
    if (!this.container) {
      return;
    }

    // Unmount current component
    if (this.currentComponent) {
      this.currentComponent.unmount();
      this.currentComponent = null;
    }

    // Clear container
    this.container.innerHTML = "";

    const match = this.matchRoute(this.currentPath);

    if (match) {
      const { ComponentClass, params } = match;
      try {
        console.log("Router.render() component class:", ComponentClass);
        this.currentComponent = new ComponentClass({ params, path: this.currentPath });

        await this.currentComponent.mount(this.container);
      } catch (error) {
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
    document.removeEventListener("click", this.clickHandler);
  }
}
