// home page
//
import { WebMVCComponent } from "web-mvc-js";

//
export default class HomePage extends WebMVCComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page home-page">
        <h1>Welcome Home</h1>
        <p>This is the home page, loaded immediately when the app starts.</p>
        <div className="hero-section">
          <h2>Dynamic Route Loading</h2>
          <p>Click on any navigation link to see dynamic imports in action!</p>
        </div>
      </div>
    );
  }
}
