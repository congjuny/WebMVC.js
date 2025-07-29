import { WebMVCComponent, WebMVCCollection } from "web-mvc-js";
import { EmployeeListView } from "./EmployeeListView";
import { EmployeeForm } from "./EmployeeForm";
import { EmployeeModel } from "./EmployeeModel";

export class App extends WebMVCComponent {
  constructor() {
    super();
    this.employeeList = new WebMVCCollection(EmployeeModel, []);

    this.loadSampleData();
  }

  loadSampleData = () => {
    const sampleEmployees = [
      { name: "John Doe", email: "john@example.com", position: "Software Developer", salary: 75000 },
      { name: "Jane Smith", email: "jane@example.com", position: "Project Manager", salary: 85000 },
      { name: "Mike Johnson", email: "mike@example.com", position: "Designer", salary: 65000 },
    ];

    sampleEmployees.forEach((employee) => {
      employee.id = this.getNewEmployeeId(); // Assign a new ID
      this.employeeList.add(employee);
    });

    console.log("After loading sample data, employeeList =", this.employeeList);
  };

  getNewEmployeeId() {
    return this.employeeList.length > 0 ? Math.max(...this.employeeList.map((emp) => emp.id)) + 1 : 1;
  }

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

  onAddOrEdit = (mode, employee) => {
    if (employee.validate()) {
      if (mode === "edit") {
        console.log("Employee with updates:", employee);
        const curremp = this.employeeList.findById(employee.id);
        if (curremp) {
          Object.assign(curremp, employee);
        }
        console.log("After update, employeeList =", this.employeeList);
      } else {
        const newemp = new EmployeeModel(employee.toPlainObject());
        newemp.id = this.getNewEmployeeId();
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
