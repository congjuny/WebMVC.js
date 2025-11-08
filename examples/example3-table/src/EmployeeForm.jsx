import { WebMVCComponent, WebMVCModel } from "web-mvc-js";
import { EmployeeModel } from "./EmployeeModel";

export class EmployeeForm extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.props = props || {};
    this.onAddOrEdit = props?.onAddOrEdit;
    this.onCancel = props?.onCancel;

    this.state = new WebMVCModel({
      mode: "add",
      employee: new EmployeeModel(),
    });

    if (this.state.addListener) {
      this.state.addListener((changes, model) => this.update(changes, model));
    }
    console.log("EmployeeForm created", this);
  }

  setEmployee(employee) {
    if (employee) {
      this.state.employee.setAllFields(employee);

      this.state.mode = "edit"; // Set mode to 'edit'
      this.update();
    } else {
      this.state.employee.reset();
      this.state.mode = "add"; // Reset mode to 'add'
    }
  }

  update(changes, model) {
    console.log("EmployeeForm.update() called, changes =", changes);

    super.update(changes, model);

    /*
    changes.forEach((change) => {
      const { path, newValue, oldValue } = change;
      if (newValue !== oldValue) {
        if (path === "name") {
          this.refs.nameInput.value = newValue;
        } else if (path === "email") {
          this.refs.emailInput.value = newValue;
        } else if (path === "position") {
          this.refs.positionInput.value = newValue;
        } else if (path === "salary" && !isNaN(newValue)) {
          this.refs.salaryInput.value = newValue;
        }
      }
    });
  */

    console.log("EmployeeForm.update() employeeModel =", this.state.employee);
  }

  render() {
    console.log("EmployeeForm.render() with name=", this.state.employee.name);
    return (
      <div class="form-section">
        <h3 ref="formTitle">{this.state.mode === "add" ? "Add New Employee" : "Edit Employee"}</h3>
        <form id="employeeForm">
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              type="text"
              id="name"
              required
              value={this.state.employee.name}
              ref="nameInput"
              onInput={(e) => this.state.employee.setName(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              required
              value={this.state.employee.email}
              ref="emailInput"
              onInput={(e) => this.state.employee.setEmail(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label for="position">Position:</label>
            <input
              type="text"
              id="position"
              required
              value={this.state.employee.position}
              ref="positionInput"
              onInput={(e) => this.state.employee.setPosition(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label for="salary">Salary:</label>
            <input
              type="number"
              id="salary"
              min="0"
              step="1000"
              required
              value={this.state.employee.salary}
              ref="salaryInput"
              onInput={(e) => this.state.employee.setSalary(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label for="isActive">Is Active:</label>
            <input
              type="radio"
              id="isActive"
              required
              checked={this.state.employee.isActive}
              ref="isActiveInput"
              onInput={(e) => this.state.employee.setIsActive(e.target.value)}
            />
          </div>

          <div class="form-buttons">
            <button
              id="submit-btn"
              ref="addButton"
              onClick={(e) => {
                e.preventDefault();
                this.onAddOrEdit(this.state.mode, this.state.employee);
              }}
            >
              {this.state.mode === "add" ? "Add New Employee" : "Edit Employee"}
            </button>
            <button
              type="button"
              ref="cancelButton"
              onClick={this.onCancel}
              class="btn-cancel"
              style={{ display: this.state.mode === "add" ? "none" : "inline-block" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}
