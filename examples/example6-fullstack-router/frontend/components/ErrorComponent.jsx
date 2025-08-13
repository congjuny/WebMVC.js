import { WebMVCComponent } from "web-mvc-js";

export class ErrorComponent extends WebMVCComponent {
  constructor(props) {
    super(props);

    this.error = this.props.error;
    this.handleClick = this.props.handleClick;
  }

  render() {
    return (
      <div className="error-page">
        <h1>Oops! Something went wrong</h1>
        <p>{this.error.message}</p>
        <button onClick={() => this.handleClick()}>Go Home</button>
      </div>
    );
  }
}
