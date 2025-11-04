// Copyright (c) 2025 Congjun Yang
//
// WebMVC.js/src/router.js
import { WebMVCComponent } from "./component";
import { getLogger, LogLevel } from "./logger.js";
import { h } from "./h.js";

const log = getLogger();
log.setLogLevel(LogLevel.DEBUG);

export class WebMVCRouter extends WebMVCComponent {
  constructor() {
    super();
    this.routes = [];
    this.currentPath = window.location.pathname;
    this.currentComponent = null;

    // to survive minification
    this.className = "WebMVCRouter";

    this.callbacks = {
      onBeforeRoute: null,
      onRouteStart: null,
      onRouteComplete: null,
      onRouteError: null,
      onRouteNotFound: null,
    };
  }

  async init(modules, basePath = "pages", defaultRoute = "/") {
    const regex = new RegExp(`^.*\\/${basePath}\\/`);
    this.routes = [];

    Object.keys(modules).forEach((path) => {
      let routePath = path
        .replace(regex, "/")
        .replace(/\/page\.jsx$/, "")
        .replace(/\[([^\]]+)\]/g, ":$1");

      this.routes.push({
        path: routePath,
        load: modules[path], // dynamic import function
      });
    });

    // Listen for browser back/forward
    window.addEventListener("popstate", () => {
      const path = window.location.pathname;
      if (this.matchRoute(path)) {
        this.navigate(path, false);
      }
    });

    if (this.matchRoute(defaultRoute)) {
      this.navigate(defaultRoute);
    }
  }

  setCallback(name, fn) {
    if (this.callbacks.hasOwnProperty(name)) {
      this.callbacks[name] = fn;
    }
  }

  // Support dynamic routes like /user/:id
  matchRoute(urlPath) {
    const params = {};

    const [urlPath0, queryString] = urlPath.split("?");
    if (queryString) {
      queryString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      });
    }

    for (const route of this.routes) {
      const routeParts = route.path.split("/").filter(Boolean);
      const urlParts = urlPath0.split("/").filter(Boolean);

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
    log.debug("Router.navigate() path:", path);

    if (pushState && path !== this.currentPath) {
      window.history.pushState({}, "", path);
    }

    this.currentPath = path;
    await this.doNavigation();
  }

  async preload(path) {
    const match = this.matchRoute(path);
    if (!match) {
      return;
    }

    // Trigger the dynamic import, but ignore the result
    match.route.load();
  }

  async doNavigation() {
    if (!this.parentElement) {
      return;
    }

    log.debug("checking onBeforeRoute...");
    if (this.callbacks.onBeforeRoute) {
      const shouldContinue = await this.callbacks.onBeforeRoute(path, params);
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
    this.element.innerHTML = "";

    if (match) {
      // before loading
      if (this.callbacks.onRouteStart) {
        this.callbacks.onRouteStart(path, params);
      }

      const module = await match.route.load();
      const ComponentClass = module.default;

      try {
        log.debug("Router.doNavigation() component class:", ComponentClass);
        if (!(ComponentClass.prototype instanceof WebMVCComponent)) {
          log.error(`${ComponentClass.name} is not a WebMVCComponent`);
        }

        this.currentComponent = new ComponentClass(match.params);

        await this.currentComponent.mount(this.element);

        if (this.callbacks.onRouteComplete) {
          this.callbacks.onRouteComplete(path, params);
        }
      } catch (error) {
        log.error("Error doNavigate():", error);
        if (this.callbacks.onRouteError) {
          this.callbacks.onRouteError(path, params, error);
        }
        throw new Error("Component mount() must return a DOM element");
      }
    } else {
      this.element.innerHTML = "<h1>404 - Page Not Found</h1>";
    }
  }

  // Cleanup method
  destroy() {
    if (this.currentComponent) {
      this.currentComponent.unmount();
    }
    window.removeEventListener("popstate", this.navigate);
  }

  render() {
    return h("div", null);
  }
}
