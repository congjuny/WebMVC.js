// loader.jsx

export class Loader extends WebMVCComponent {
  //constructor(props) {
  //  super(props); // Call the parent constructor
  // }

  render() {
    return (
      <div>
        <div>{this.props.msg}</div>
        <div class="loading" style={`margin: ${this.props.margin || 30}px;`}></div>
      </div>
    );
  }
}
