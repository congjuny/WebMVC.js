//
import { WebMVCComponent } from "web-mvc-js";

export default class AdminPage extends WebMVCComponent {
  constructor(props) {
    super(props);

    // Simulate heavier component with more dependencies
    this.adminStats = {
      users: 1234,
      revenue: "$56,789",
      orders: 890,
    };
  }

  render() {
    return (
      <div className="page admin-page">
        <h1>Admin Dashboard</h1>
        <p>This admin page was loaded as a separate chunk.</p>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Users</h3>
            <p>{this.adminStats.users}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p>{this.adminStats.revenue}</p>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <p>{this.adminStats.orders}</p>
          </div>
        </div>

        <div className="admin-actions">
          <button>Manage Users</button>
          <button>View Reports</button>
          <button>Settings</button>
        </div>
      </div>
    );
  }
}
