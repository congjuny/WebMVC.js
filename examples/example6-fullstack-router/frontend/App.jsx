import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/page.jsx";
import { ErrorComponent } from "./components/ErrorComponent.jsx";

export default class App extends WebMVCComponent {
  constructor() {
    super();

    this.state = new WebMVCModel();
    this.router = new WebMVCRouter();

    this.state.currentRoute = new HomePage();
    this.state.isLoading = false;

    //this.setupRouterCallbacks();
  }

  setupRouterCallbacks() {
    // may be used to check if user logged in
    this.router.setCallback("onRouteStart", (path, parms) => {
      console.log(`Starting navigation to: ${path} parms: ${parms}`);
      this.state.isLoading = true;
    });

    this.router.setCallback("onRouteError", (path, parms, error) => {
      console.error(`Route error for ${path}, parms: ${parms}:`, error);
      this.state.isLoading = false;
      this.state.currentRoute = new ErrorComponent({ error: error, handleClick: () => this.router.navigate("/") });
    });
  }

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

    await this.router.init(modules);
    this.router.install(this.refs["childPages"]);
  }

  render() {
    return (
      <div class="app-layout">
        <header class="app-header">
          <Navbar onNavigate={this.handleNavigation} onPreload={this.handlePreload} currentPath={this.router.currentRoute} />
        </header>

        <div class="app-body">
          <main class="main-content" ref="main">
            {this.isLoading ? (
              <div class="loading-spinner">
                <p>Loading route...</p>
                {/* You could add a fancy spinner here */}
              </div>
            ) : this.state.currentRoute ? (
              <div ref="childPages"></div>
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
