// Layout.jsx

// Layout component for the application
export default class Layout extends WebMVCComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="app-layout">
        <header class="app-header">
          {this.props.children[0]} {/* Navbar */}
        </header>

        <div class="app-body">
          {this.props.children[1]} {/* Main content */}
        </div>

        <footer class="app-footer">
          <p>&copy; 2025 My SPA. Built with Vite and Dynamic Imports.</p>
        </footer>
      </div>
    );
  }
}
