import { App } from "./App";

const app = new App();
app.mount(document.body);

console.log("App mounted. Model count:", app.model.count);

const input = app.childComponents["counter-input"].refs["count"];

console.log("app mounted. counter input ref:", input);
