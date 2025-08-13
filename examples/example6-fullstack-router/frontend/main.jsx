// main.jsx
import App from "./App.jsx";

const app = new App();
app.mount(document.body);
console.log("app mounted.");

app.router.mount(app.childComponents["layout"].refs["childPages"]);
