<img src="images/WebMVC.svg" alt="WebMVC Logo" width="400" />

A modern JavaScript library for building **Single-Page Applications** (SPA) with a clean **Model–View–Controller** (MVC) architecture. You define the application views with **JSX syntax**. No virtual DOM, just simplicity and speed. No hooks to a global blackbox state machine, you define and control your data model and state. Don't over-engineer. This is Web programming the way it should have been!

## ✨ Features

- 🧩 **Component-based** UI architecture with JSX syntax for views. ES6 class syntax for components and data models. A component class serves as the controller for the corresponding DOM element from the render() function. You may add a "ref" attribute for any DOM element or an Id attribute for your custom child component if you need access to it in your controller functions.
- 🧠 **Model-driven state management** (Observer-style and Proxy based)
- ⚡ **JSX support** (via a lightweight `h()` function). support both class and className attributes for easy migrations.
- 🔁 **Automatic re-render on model changes**. The default behavior is re-rendering the whole component with a quick merge algorithm to minimize UI updates. This should be efficient for the vast majority of use cases. You may override it with your own update() function if you want more control on your component re-rendering. You have direct access to any DOM element with a "ref" attribute.
- 🧼 **Minimal runtime**, no dependencies
- 👉 **File-Based routing** to encourage neat project organization. Automatic route discovery - a file directory is mapped to a route if it contains a page.jsx file with a default export. Dynamic import so that a chunk for a directory is loaded only when the corresponding route is accessed. Also support preload if needed.
- 🛠 Built with **Vite**, it's the JSX transformer through a lightweight `h()` and live server.

## 🚀 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/congjuny/WebMVC.js.git

## for framework development - link framework locally
cd WebMVC.js/framework
npm link

cd WebMVC.js/examples/example1-counter

## install local framework for your project
npm link web-mvc-js

npm install
npm run dev
```

## ✨ Contributions

How to help? Come out with examples that challenge the framework. We will make it harder and harder to do so 😃.
