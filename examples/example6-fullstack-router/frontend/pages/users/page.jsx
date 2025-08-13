//
import { WebMVCComponent } from "web-mvc-js";

//
export default class UsersPage extends WebMVCComponent {
  render() {
    return (
      <div className="page users-page">
        <h1>User Management</h1>
        <p>User management interface loaded as a separate chunk.</p>

        <div className="user-controls">
          <button>Add User</button>
          <button>Import Users</button>
          <button>Export Data</button>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
