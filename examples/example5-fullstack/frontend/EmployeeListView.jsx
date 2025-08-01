import { WebMVCComponent } from "web-mvc-js";
import { Loader } from "./loader"; // Assuming you have a Loader component for loading state
import { ConfirmModal } from "./modal/modal";

export class EmployeeListView extends WebMVCComponent {
  constructor(props) {
    super(props); // Call the parent constructor
    this.model = props?.model;
    this.onEdit = props?.onEdit;
    this.onDelete = props?.onDelete;

    this.model.isConfirmOpen = false;

    console.log("EmployeeListView created", this);

    if (this.model?.addListener) {
      this.model.addListener((changes, model) => this.update(changes, model));
    }
  }

  handleDeleteConfirm = (id) => {
    console.log("Confirm deletion for employee ID:", id);
    this.onDelete(id);
    this.model.isConfirmOpen = false; // Close the confirmation modal
  };

  handleDeleteCancel = () => {
    console.log("Deletion cancelled");
    this.model.isConfirmOpen = false; // Close the confirmation modal
  };

  showConfirmDeleteModal = (id) => {
    console.log("Showing confirm delete modal for employee ID:", id);
    this.current_id = id;
    this.model.isConfirmOpen = true; // Open the confirmation modal
  };

  update(changes, model) {
    console.log("EmployeeList.update() called, changes =", changes, "model =", model);

    // either directly update the element or call base update to re-create the DOM
    super.update(changes, model);
  }

  render() {
    console.log("EmployeeListView.render() with employees =", this.model);
    this.model?.items?.map((employee) => {
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
            {this.model?.loading ? (
              <tr>
                <td colSpan="6" style="text-align: center;">
                  <Loader msg="Loading employees........" margin={30} />
                </td>
              </tr>
            ) : this.model?.items?.length > 0 ? (
              this.model.items.map((employee) => (
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
                    <button class="btn-delete" onClick={() => this.showConfirmDeleteModal(employee.id)}>
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
        <ConfirmModal
          isOpen={this.model.isConfirmOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this employee?"
          onConfirm={() => this.handleDeleteConfirm(this.current_id)}
          onCancel={() => this.handleDeleteCancel()}
        />
      </div>
    );
  }
}
