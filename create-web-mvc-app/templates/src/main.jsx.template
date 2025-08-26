// main.jsx
import App from "./App.jsx";

const app = new App();
app.mount(document.body);
console.log("app mounted.");

await app.router.init();
app.router.mount(app.childComponents["layout"].refs["childPages"]);
