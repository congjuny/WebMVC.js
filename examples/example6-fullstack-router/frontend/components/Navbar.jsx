// src/components/Navbar.jsx

export default class Navbar extends WebMVCComponent {
  constructor(props) {
    super(props);

    //const { onNavigate, onPreload, currentPath } = this.props;
    this.onNavigate = this.props.onNavigate;
    this.onPreload = this.props.onPreload;
    this.currentPath = this.props.currentPath;

    this.navItems = [
      { path: "/", label: "Home" },
      { path: "/about", label: "About" },
      { path: "/products", label: "Products" },
      { path: "/users", label: "Users" },
      { path: "/admin", label: "Admin" },
    ];
  }

  handleClick = (e, path) => {
    e.preventDefault();
    this.onNavigate(path);
  };

  handleMouseEnter = (path) => {
    // Preload route on hover for better perceived performance
    this.onPreload(path);
  };

  render() {
    return (
      <nav class="navbar">
        <div class="nav-brand">
          <h2>My SPA</h2>
        </div>
        <ul class="nav-links">
          {this.navItems.map(({ path, label }) => (
            <li key={path}>
              <a
                href={path}
                class={this.currentPath === path ? "active" : ""}
                onClick={(e) => this.handleClick(e, path)}
                onMouseEnter={() => this.handleMouseEnter(path)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
