//
import { WebMVCComponent } from "web-mvc-js";

// layout.jsx
export default class Layout extends WebMVCComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app-layout">
        <header className="app-header">
          {this.props.children[0]} {/* Navbar */}
        </header>

        <div className="app-body">
          {this.props.children[1]} {/* Main content */}
        </div>

        <footer className="app-footer">
          <p>&copy; 2025 My SPA. Built with Vite and Dynamic Imports.</p>
        </footer>
      </div>
    );
  }
}
