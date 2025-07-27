<img src="images/WebMVC.svg" alt="WebMVC Logo" width="400" />

A modern JavaScript framework for building **single-page applications** with a clean **Model–View–Controller** (MVC) architecture. You define the application views with **JSX syntax** augmented with references to DOM elements and components. No virtual DOM, just simplicity and speed. No hooks to a global blackbox state machine. You define and control your data model and state - This is Web programming the way it should have been!

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

## ✨ Contributions

How to help? Come out with examples that challenge the framework. We will make it harder and harder to do so 😃.
