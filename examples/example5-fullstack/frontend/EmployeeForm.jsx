import { WebMVCComponent } from "web-mvc-js";
import { EmployeeModel } from "./EmployeeModel";

export class EmployeeForm extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.props = props || {};
    this.onAddOrEdit = props?.onAddOrEdit;
    this.onCancel = props?.onCancel;

    this.mode = "add"; // Default mode is 'add'

    this.model = new EmployeeModel(); // Initialize model

    if (this.model?.addListener) {
      this.model.addListener((changes, model) => this.update(changes, model));
    }
    console.log("EmployeeForm created", this);
  }

  setEmployee(employee) {
    // we could add a "mode" property to the model so that UI updates are handled in update()
    if (employee) {
      //Object.assign(this.model, employee); // Copy all properties from employee to model
      //this.model.update(employee);

      this.model.setAllFields(employee);

      this.refs.addButton.textContent = "Update Employee";
      this.refs.cancelButton.style.display = "inline-block";
      this.refs.formTitle.textContent = "Edit Employee";
      this.mode = "edit"; // Set mode to 'edit'
    } else {
      this.model.reset();
      this.refs.addButton.textContent = "Add Employee";
      this.refs.cancelButton.style.display = "none";
      this.refs.formTitle.textContent = "Add New Employee";
      this.mode = "add"; // Reset mode to 'add'
    }
  }

  update(changes, model) {
    console.log("EmployeeForm.update() called, changes =", changes);
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
  }

  render() {
    console.log("EmployeeForm.render() with name=", this.model?.name);
    return (
      <div class="form-section">
        <h3 ref="formTitle">Add New Employee</h3>
        <form id="employeeForm">
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              type="text"
              id="name"
              required
              value={this.model?.name}
              ref="nameInput"
              onInput={(e) => this.model.setName(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              required
              value={this.model?.email}
              ref="emailInput"
              onInput={(e) => this.model.setEmail(e.target.value)}
            />
          </div>

          <div class="form-group">
            <label for="position">Position:</label>
            <input
              type="text"
              id="position"
              required
              value={this.model?.position}
              ref="positionInput"
              onInput={(e) => this.model.setPosition(e.target.value)}
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
              value={this.model?.salary}
              ref="salaryInput"
              onInput={(e) => this.model.setSalary(e.target.value, this.model)}
            />
          </div>

          <div class="form-buttons">
            <button
              id="submit-btn"
              ref="addButton"
              onClick={(e) => {
                e.preventDefault();
                this.onAddOrEdit(this.mode, this.model);
              }}
            >
              Add Employee
            </button>
            <button type="button" ref="cancelButton" onClick={this.onCancel} class="btn-cancel" style="display: none;">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}
