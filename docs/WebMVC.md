# WebMVC.js – A JavaScript Library for SPA

# Introduction

## What is WebMVC.js

WebMVC.js is a modern, lightweight JavaScript library for building Single-Page Applications (SPA) using a clean Model–View–Controller (MVC) architecture — combining the clarity and separation of MVC with a minimal, no-frills runtime. ([GitHub](https://github.com/congjuny/WebMVC.js))

Unlike many heavy or opinionated frameworks, WebMVC.js gives you **plain JavaScript (ES6) + declarative UI syntax (JSX via a small h() function)** — with no virtual DOM, no heavy global state machinery, and no forced conventions beyond MVC.

## Core Philosophy & What Makes It Different

- Simplicity over complexity. WebMVC.js avoids heavy abstractions: you write your models, views, and controllers using familiar JS and JSX. There are no hidden magic parts, no large dependency trees. Just clear, maintainable code.
- Component-based UI with MVC discipline. Each component is defined as a class: that class doubles as the controller for its UI. You manage state in model classes (plain JS), and react to state changes with automatic re-rendering.
- Reactive, model-driven UI updates. WebMVC.js uses observer-style or Proxy-based state tracking so that when model data changes, the framework triggers re-render of the relevant component automatically — giving a reactive feel without the overhead of a full virtual-DOM diffing engine.
- Minimal runtime. The runtime is tiny; you don’t need bulky libraries or frameworks. WebMVC.js aims to be as close to “vanilla JS + JSX + MVC structure” as possible, leaving you full control over your code.
- File-based routing & code splitting for SPAs. WebMVC.js offers built-in, file-based routing: directories map to routes automatically if they contain a page.jsx. It uses dynamic imports (lazy loading) so that route-specific code loads only when needed — keeping initial load small and speeding up performance.

## Typical Use Case & Workflow

Using WebMVC.js tends to follow this pattern:

- Define model classes (plain ES6 classes) that represent your application state/data.
- Define component/controller classes — each with a render() method using JSX that returns UI description.
- Use file-based routing: organize your application into folders for different routes/pages; WebMVC.js dynamically loads the code when the user navigates.
- When models change, WebMVC.js automatically updates the view, re-rendering the component (or allowing you to customize by overriding an update() method).

This workflow gives you a **clear separation between data (model), presentation (view), and logic/interaction (controller)** — preserving the benefits of classic MVC — but with modern SPA development ergonomics: declarative UI, reactive updates, and lazy loading.

## Why WebMVC.js — When It’s a Good Fit

WebMVC.js makes sense when you want:

- A small, dependency-free framework that doesn’t add complexity or heavy abstractions.
- The structure and maintainability of MVC (clear separation of concerns, organized components), without sacrificing the interactivity and responsiveness of SPAs.
- Flexibility to use plain JS / JSX without “learning another framework’s mindset.”
- Performance-conscious SPA architecture — with code splitting and minimal runtime overhead.
- A self-contained front-end application that doesn’t rely on external heavy frameworks but still benefits from declarative UI + reactive state.

# A Quick Start Guide

This guide walks you through creating your first WebMVC.js Single-Page Application using JSX, models, and components.

## Prerequisites

- Node.js (20+ recommended)
- A bundler that supports JSX (e.g., Vite)
- Basic familiarity with ES modules

## A "Hello, World!" application with webMVC.js

The finished application looks as follows:

<div style="border: 2px solid #333; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
  <div>
    <h1 style="text-align: center;">Counter Title</h1>
    <p>A 'Hello, World!' app with MVC design pattern</p>
    <h2>Count: 0</h2>
  </div>
  <div style="display: flex; gap: 1em;">
    <button style="color: blue">Increment</button>
    <button style="color: red">Decrement</button>
  </div>
</div>

**1. Project Files**

We use vite as our dev tool. Here is a simple vite config file

```bash
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "h", // tells Vite/ESBuild to use `h` as the JSX factory
    jsxFragment: "Fragment", // tells Vite/ESBuild to use `Fragment` for JSX fragments
    jsxInject: `import { h, Fragment } from 'web-mvc-js';`, // injects the import automatically
  },
});
```

Add web-mvc-js to your package.json

```bash
{
  "name": "counter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^7.0.4"
  },
  "dependencies": {
    "web-mvc-js": "^0.2.0"
  }
}
```

**2. JS and JSX source code**

Our source code files go to the src directory. Let's first create our model class that extends WebMVCModel.
WebMVCModel will wrap your data inside a proxy so that you can listen to the changes and update the UI accordingly.

```
// CounterModel.js
import { WebMVCModel } from "web-mvc-js";

export class CounterModel extends WebMVCModel {
  count = 0;

  increment() {
    this.count++;
    console.log("CounterProxyModel Incremented to", this.count);
  }

  decrement() {
    this.count--;
    console.log("CounterProxyModel Decremented to", this.count);
  }
}
```

Now we create a commponent for the buttons

```bash
// CounterButton.jsx
import { WebMVCComponent } from "web-mvc-js";

export class CounterButton extends WebMVCComponent {
  constructor(props) {
    super(props);
    // allow the caller to pass in the label and a listener to make it reusable
    this.label = props.label;
    this.handler = props.onClick;
  }

  render() {
    console.log("Rendering Button with label =", this.label);
    return (
      <button onClick={this.handler} style={{ color: this.label === "Decrement" ? "red" : "blue" }}>
        {this.label}
      </button>
    );
  }
}
```

And here is a component that displays some text and the actual counter

```bash
// CounterDisplay.jsx
import { WebMVCComponent } from "web-mvc-js";

export class CounterDisplay extends WebMVCComponent {
  constructor(props) {
    super(props); // optional if your base class uses model
    this.model = props.model;

    if (this.model?.addListener) {
      this.model.addListener((changes, model) => this.update(changes, model));
    }
  }

  render() {
    console.log("CounterDisplay.render() with count =", this.model?.count);
    return (
      <div>
        <h1 style="text-align: center;">Counter Title</h1>
        <p>A 'Hello, World!' app with MVC design pattern</p>
        <h2>Count: {this.model?.count}</h2>
      </div>
    );
  }
}
```

As you can see from the above two components, we can summarize as follows.

- Each component is a JavaScript class that extends WebMVCComponent base class
- Each component needs to implement the render() function that returns a JSX element.
- You can pass props to a component class
- WebMVCComponent implements a update() function. It's called to re-render the component.
- You can override the update() function to implement your own re-rendering logic.
- If the component has a model, which you normally do, you can add a listener to call the update() function to refresh the UI when the model changes.

Now, let's composite the components to make the whole page.

```
// App.jsx
import { WebMVCComponent } from "web-mvc-js";
import { CounterDisplay } from "./CounterDisplay";
import { CounterButton } from "./CounterButton";
import { CounterModel } from "./CounterModel";

export class App extends WebMVCComponent {
  constructor() {
    const model = new CounterModel();
    super({ model });
    this.model = model;
  }

  render() {
    console.log("App render() called");
    return (
      <div>
        <CounterDisplay model={this.model} />
        <div style="display: flex; gap: 1em;">
          <CounterButton
            label="Increment"
            onClick={() => this.model.increment()}
          />
          <CounterButton
            label="Decrement"
            onClick={() => this.model.decrement()}
          />
        </div>
      </div>
    );
  }
}
```

The data model is defined at the app level. The count is incremented or decremented when the user clicks on
the buttons. The model is also passed into the CounterDisplay component which shows the count. The CounterDisplay
also listens to model changes to refresh the component contents.

Here is the application entry point.

```
// main.jsx
import { App } from './App';

const app = new App();
app.mount(document.body);
```

Please visit [GitHub](https://github.com/congjuny/WebMVC.js) for complete source code of examples.

**🎉 You now have:**

- A working SPA
- JSX-based declarative UI
- Reactive model updates
- Lightweight MVC architecture

WebMVC.js keeps the mental model simple—**Models hold data, Components render UI, and the framework auto-updates the view**.

## create-web-mvc-app

A Counter application with webMVC.js

Routing works automatically based on folder names.
