import { App } from "./App";

const app = new App();
app.mount(document.body);

console.log("App mounted. Model count:", app.model.count);

//console.log("app mounted. counter input ref:", app.getRef("counterInput"));
