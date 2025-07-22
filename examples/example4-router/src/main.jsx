import { HomePage } from "./pages/Home.jsx";
import { UsersPage } from "./pages/Users.jsx";
import { UserPage } from "./pages/User.jsx";
import { AboutPage } from "./pages/About.jsx";

import { App } from "./App";

// Create router and define routes
const router = new Router()
  .route("/", HomePage)
  .route("/users", UsersPage)
  .route("/user/:id", UserPage)
  .route("/about", AboutPage);

const app = new App();
app.mount(document.body);

// Mount router
const outlet = app.refs["router-outlet"];
router.mount(outlet);
