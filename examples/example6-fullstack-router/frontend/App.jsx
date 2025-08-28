import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/page.jsx";
//import { ErrorComponent } from "./components/ErrorComponent.jsx";
//import { WebMVCRouter } from "../../../framework/src/router.js";

export default class App extends WebMVCComponent {
  constructor() {
    super();

    this.state = new WebMVCModel();

    this.state.currentRoute = new HomePage();
    this.state.isLoading = false;

    //this.setupRouterCallbacks();
  }

  /* 
  // uncomment if needed
  setupRouterCallbacks() {
    // may be used to show a loading progress indicator
    this.router.setCallback("onRouteStart", (path, parms) => {
      console.log(`Starting navigation to: ${path} parms: ${parms}`);
      this.state.isLoading = true;
    });

    this.router.setCallback("onRouteComplete", (path, parms) => {
      console.log(`Completed navigation to: ${path} parms: ${parms}`);
      this.state.isLoading = false;
    });

    this.router.setCallback("onBeforeRoute", (path, parms) => {
      console.log(`Before navigation to: ${path} parms: ${parms}`);
      // Check if user is logged in
      if (!this.state.isLoggedIn) {
        console.warn(`User is not logged in. Redirecting to login page.`);
        this.router.navigate("/login");
        return false; // Prevent navigation
      }
    });

    this.router.setCallback("onRouteError", (path, parms, error) => {
      console.error(`Route error for ${path}, parms: ${parms}:`, error);
      this.state.isLoading = false;
      this.state.currentRoute = new ErrorComponent({ error: error, handleClick: () => this.router.navigate("/") });
    });
  }
  */

  handleNavigation = (path) => {
    this.router.navigate(path);
  };

  handlePreload = (path) => {
    // preload route chunk on hover over navbar item for better UX
    //this.router.preload(path);
  };

  async afterMount() {
    // vite will find all jsx files and get the default export components as routes
    const modules = import.meta.glob("./pages/**/page.jsx");

    // this.router is a reference to the WebMVCRouter instance
    await this.router.init(modules, "pages", "/");
  }

  render() {
    return (
      <div class="app-layout">
        <header class="app-header">
          <Navbar onNavigate={this.handleNavigation} onPreload={this.handlePreload} currentPath={this.state.currentRoute} />
        </header>

        <div class="app-body">
          <main class="main-content" ref="main">
            {this.isLoading ? (
              <div class="loading-spinner">
                <p>Loading route...</p>
                {/* You could add a fancy spinner here */}
              </div>
            ) : this.state.currentRoute ? (
              <WebMVCRouter />
            ) : (
              <p>No route loaded</p>
            )}
          </main>
        </div>

        <footer class="app-footer">
          <p>&copy; 2025 My SPA. Built with Vite and Dynamic Imports.</p>
        </footer>
      </div>
    );
  }
}
