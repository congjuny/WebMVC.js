# WebMVC.js

A modern JavaScript framework for building **single-page applications** with a clean **Model–View–Controller** (MVC) architecture and **JSX syntax**. No virtual DOM, just simplicity and speed. No hooks, you define and control you data model and state

## ✨ Features

- 🧩 **Component-based** UI architecture with JSX syntax. A component class defined serves as the controller for the corresponding DOM component returned from the render() function. You may add a "ref" attribute for any DOM element or an Id attribute for your custom component if you need access to access to it in your controller functions.
- 🧠 **Model-driven state management** (Observer-style)
- ⚡ **JSX support** (via a lightweight `h()` function)
- 🔁 **Automatic re-render on model changes**. The default behavior is re-rendering the whole component. You may override it with your own update() function. You have direct access to any DOM element with a "ref" attribute.
- 🧼 **Minimal runtime**, no dependencies
- 👉 **File-Based routing** to encourage neat project organization.
- 🛠 Built with **Vite**, it's the JSX transformer and live server.

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
