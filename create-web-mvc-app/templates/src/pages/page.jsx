// home page

// HomePage.jsx
export default class HomePage extends WebMVCComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div class="page home-page">
        <h1>Welcome Home</h1>
        <p>This is the home page, loaded immediately when the app starts.</p>
        <div class="hero-section">
          <h2>Dynamic Route Loading</h2>
          <p>Click on any navigation link to see dynamic imports in action!</p>
        </div>
      </div>
    );
  }
}
