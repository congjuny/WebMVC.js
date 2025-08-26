// loader.jsx

// ErrorComponent.jsx
export class ErrorComponent extends WebMVCComponent {
  constructor(props) {
    super(props);

    this.error = this.props.error;
    this.handleClick = this.props.handleClick;
  }

  render() {
    return (
      <div class="error-page">
        <h1>Oops! Something went wrong</h1>
        <p>{this.error.message}</p>
        <button onClick={() => this.handleClick()}>Go Home</button>
      </div>
    );
  }
}
