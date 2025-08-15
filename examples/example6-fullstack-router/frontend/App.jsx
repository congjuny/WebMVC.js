import Navbar from "./components/Navbar.jsx";
import Layout from "./components/Layout.jsx";
//import { Router, WebMVCComponent, WebMVCModel } from "web-mvc-js";
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
    // Preload route on hover for better UX
    //this.router.preload(path);
  };

  render() {
    return (
      <Layout id="layout">
        <Navbar onNavigate={this.handleNavigation} onPreload={this.handlePreload} currentPath={this.router.currentRoute} />

        <main class="main-content" ref="main">
          {this.isLoading ? (
            <div class="loading-spinner">
              <p>Loading route...</p>
              {/* You could add a fancy spinner here */}
            </div>
          ) : this.state.currentRoute ? (
            <div ref="childPages"></div>
          ) : (
            <div>No route loaded</div>
          )}
        </main>
      </Layout>
    );
  }
}
