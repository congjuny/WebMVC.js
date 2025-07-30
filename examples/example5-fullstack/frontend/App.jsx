import { WebMVCComponent, WebMVCCollection } from "web-mvc-js";
import { EmployeeListView } from "./EmployeeListView";
import { EmployeeForm } from "./EmployeeForm";
import { EmployeeModel } from "./EmployeeModel";

export class App extends WebMVCComponent {
  constructor() {
    super();
    this.employeeList = new WebMVCCollection(EmployeeModel, []);

    this.loadEmployees();
  }

  loadEmployees = () => {
    fetch("/api/employees")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch employees");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Employees:", data);

        if (Array.isArray(data)) {
          data.forEach((employee) => {
            this.employeeList.add(employee);
          });
        } else {
          console.warn("Expected an array of employees, but got:", data);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });

    console.log("After loading sample data, employeeList =", this.employeeList);
  };

  addEmployee = (data) => {
    console.log("Adding employee with data:", JSON.stringify(data));
    return fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to add employee");
      return res.json();
    });
  };

  updateEmployee = (data) => {
    return fetch(`/api/employees/${data.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to update employee");
      return res.json();
    });
  };

  onStartEdit = (id) => {
    const employee = this.employeeList.findById(id);
    this.childComponents["employeeForm"].setEmployee(employee.toPlainObject());
  };

  onCancel = () => {
    this.childComponents["employeeForm"].setEmployee(null);
  };

  onDelete = (id) => {
    const employee = this.employeeList.findById(id);
    if (employee) {
      this.employeeList.remove(employee);
    }
  };

  onAddOrEdit = async (mode, employee) => {
    if (employee.validate()) {
      if (mode === "edit") {
        console.log("Employee with updates:", employee);
        const curremp = this.employeeList.findById(employee.id);
        if (curremp) {
          Object.assign(curremp, employee);
        }
        this.updateEmployee(curremp.toPlainObject());
        console.log("After update, employeeList =", this.employeeList);
      } else {
        const tmp = await this.addEmployee(employee.toPlainObject());
        console.log("New employee added to DB:", tmp);

        const newemp = new EmployeeModel(tmp);
        console.log("Adding new employee:", newemp);
        this.employeeList.add(newemp);
      }
      this.childComponents["employeeForm"].setEmployee(null);
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  render() {
    console.log("App render() called");
    return (
      <div class="container">
        <h1>Employee Management System</h1>
        <EmployeeForm id="employeeForm" onAddOrEdit={this.onAddOrEdit} onCancel={this.onCancel} />
        <EmployeeListView id="employeeListView" model={this.employeeList} onEdit={this.onStartEdit} onDelete={this.onDelete} />
      </div>
    );
  }
}
