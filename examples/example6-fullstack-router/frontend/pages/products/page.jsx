//
import { WebMVCComponent } from "web-mvc-js";
//
export default class ProductsPage extends WebMVCComponent {
  constructor() {
    super();
    this.products = [
      { id: 1, name: "Widget A", price: 29.99 },
      { id: 2, name: "Gadget B", price: 49.99 },
      { id: 3, name: "Tool C", price: 19.99 },
    ];
  }

  render() {
    return (
      <div className="page products-page">
        <h1>Our Products</h1>
        <p>Product listing loaded dynamically with its own chunk.</p>

        <div className="product-grid">
          {this.products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
