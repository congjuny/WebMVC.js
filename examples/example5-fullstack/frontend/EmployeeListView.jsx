import { WebMVCComponent, WebMVCModel } from "web-mvc-js";
import { Loader } from "./loader"; // Assuming you have a Loader component for loading state
import { ConfirmModal } from "./modal/modal";

export class EmployeeListView extends WebMVCComponent {
  constructor(props) {
    super(props); // Call the parent constructor
    this.onEdit = props?.onEdit;
    this.onDelete = props?.onDelete;

    this.employeeList = props?.model;
    this.state = new WebMVCModel({
      loading: true,
      isConfirmOpen: false,
    });

    this.employeeList.addListener((changes, model) => this.update(changes, model));
    this.state.addListener((changes, model) => this.update(changes, model));
    console.log("EmployeeListView created", this);
  }

  afterMount() {
    console.log(`${this.constructor.name} afterMount() called ...........`);
    //setTimeout(() => this.loadEmployees(), 0);
    this.loadEmployees();
  }

  loadEmployees = () => {
    //this.state.loading = true;
    console.log("Before loading sample data, employeeList =", this.employeeList);
    // Set loading state
    fetch("/api/employees")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch employees");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Employees:======================", data);

        if (Array.isArray(data)) {
          data.forEach((employee) => {
            this.employeeList.add(employee);
          });
        } else {
          console.warn("Expected an array of employees, but got:", data);
        }
        this.state.loading = false;
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => {
        this.state.loading = false;
      });
  };

  onLoad = () => {
    this.employeeList.clear();
    this.state.loading = true;

    this.loadEmployees();
  };

  handleDeleteConfirm = (id) => {
    console.log("Confirm deletion for employee ID:", id);
    this.onDelete(id);
    this.state.isConfirmOpen = false; // Close the confirmation modal
  };

  handleDeleteCancel = () => {
    console.log("Deletion cancelled");
    this.state.isConfirmOpen = false; // Close the confirmation modal
  };

  showConfirmDeleteModal = (id) => {
    console.log("Showing confirm delete modal for employee ID:", id);
    this.current_id = id;
    this.state.isConfirmOpen = true; // Open the confirmation modal
  };

  update(changes, model) {
    console.log("EmployeeList.update() called, changes =============================================", changes, "model =", model);

    // either directly update the element or call base update to re-create the DOM
    super.update(changes, model);

    console.log("EmployeeList.update() refs=", this.refs);
  }
  /*
   */

  render() {
    console.log("EmployeeListView.render() with employees =", this.employeeList);
    this.employeeList.items?.map((employee) => {
      console.log("EmployeeListView.render() employee =", employee);
    });

    return (
      <div class="table-section">
        <h3>Employee List</h3>
        <table id="employeeTable" ref="employeeTable">
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
            {this.state.loading ? (
              <tr>
                <td colSpan="6" style="text-align: center;">
                  <Loader msg="Loading employees........" margin={30} />
                  {/*
                  <div>Loading Employees....</div>
                  */}
                </td>
              </tr>
            ) : this.employeeList.items?.length > 0 ? (
              this.employeeList.items.map((employee) => (
                // added ref only to test DOM merge function
                <tr key={employee.id} ref={"id-" + employee.id}>
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
        <button
          ref="loadButton"
          class="form-buttons"
          onClick={(e) => {
            e.preventDefault();
            this.onLoad();
          }}
        >
          Load Employees
        </button>
        <ConfirmModal
          isOpen={this.state.isConfirmOpen}
          title="Confirm Deletion"
          message="Are you sure you want to delete this employee?"
          onConfirm={() => this.handleDeleteConfirm(this.current_id)}
          onCancel={() => this.handleDeleteCancel()}
        />
      </div>
    );
  }
}
