import { WebMVCModel, WebMVCComponent } from "web-mvc-js";

export class EmployeeListView extends WebMVCComponent {
  constructor(props) {
    super(props); // Call the parent constructor
    this.model = new WebMVCModel({ employeeList: props?.model });
    this.onEdit = props?.onEdit;
    this.onDelete = props?.onDelete;
    console.log("EmployeeListView created", this);

    if (this.model?.addListener) {
      this.model.addListener((changes, model) => this.update(changes, model));
    }
  }

  update(changes, model) {
    console.log("EmployeeList.update() called, changes =", changes, "model =", model);

    // either directly update the element or call base update to re-create the DOM
    super.update(changes, model);
  }

  render() {
    console.log("EmployeeListView.render() with employees =", this.model.employeeList);
    this.model.employeeList.map((employee) => {
      console.log("EmployeeListView.render() employee =", employee);
    });

    return (
      <div class="table-section">
        <h3>Employee List</h3>
        <table id="employeeTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="employeeTableBody">
            {this.model.employeeList.length > 0 ? (
              this.model.employeeList.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.position}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <button class="btn-edit" onClick={() => this.onEdit(employee.id)}>
                      Edit
                    </button>
                    <button class="btn-delete" onClick={() => this.onDelete(employee.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colspan="6" class="no-records">
                  No employees found. Add some employees to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
