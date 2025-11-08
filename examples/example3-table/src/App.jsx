// set log level for library
import { LogLevel, SetComponentLogLevel } from "web-mvc-js";
import { WebMVCComponent, WebMVCModel } from "web-mvc-js";
import { EmployeeListView } from "./EmployeeListView";
import { EmployeeForm } from "./EmployeeForm";
import { EmployeeModel } from "./EmployeeModel";

export class App extends WebMVCComponent {
  constructor() {
    super();

    this.state = new WebMVCModel({
      employeeList: [],
    });

    this.loadSampleData();

    this.state.addListener((changes, model) => this.update(changes, model));

    SetComponentLogLevel(import.meta.env.VITE_PUBLIC_LOG_LEVEL);
  }

  loadSampleData = () => {
    const sampleEmployees = [
      { name: "John Doe", email: "john@example.com", position: "Software Developer", salary: 75000 },
      { name: "Jane Smith", email: "jane@example.com", position: "Project Manager", salary: 85000 },
      { name: "Mike Johnson", email: "mike@example.com", position: "Designer", salary: 65000 },
    ];

    sampleEmployees.forEach((employee) => {
      employee.id = this.getNewEmployeeId(); // Assign a new ID
      this.state.employeeList.push(employee);
    });

    console.log("After loading sample data, employeeList =", this.state.employeeList);
  };

  getNewEmployeeId() {
    return this.state.employeeList.length > 0 ? Math.max(...this.state.employeeList.map((emp) => emp.id)) + 1 : 1;
  }

  findById(id) {
    return this.state.employeeList.find((emp) => emp.id === id);
  }

  onStartEdit = (id) => {
    const employee = this.findById(id);
    this.childComponents["employeeForm"].setEmployee(employee);
  };

  onCancel = () => {
    this.childComponents["employeeForm"].setEmployee(null);
  };

  onDelete = (id) => {
    this.state.employeeList = this.state.employeeList.filter((emp) => emp.id !== id);
    console.log("employeeList (deleted ID: %d): %O", id, this.state.employeeList);
  };

  onAddOrEdit = (mode, employee) => {
    console.log("App.onAddOrEdit() mode=", mode);
    if (employee.validate()) {
      if (mode === "edit") {
        console.log("Employee with updates:", employee);
        const curremp = this.findById(employee.id);
        if (curremp) {
          Object.assign(curremp, employee);
        }
        console.log("After update, employeeList =", this.state.employeeList);
      } else {
        const newemp = new EmployeeModel(employee);
        newemp.id = this.getNewEmployeeId();
        console.log("Adding new employee:", newemp);
        this.state.employeeList.push(newemp);
      }
      this.childComponents["employeeForm"].setEmployee(null);
      this.update();
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  update(changes, model) {
    console.log("App.update() called, changes =", changes, "model =", model);

    super.update(changes, model);
  }

  render() {
    console.log("App render() called");
    return (
      <div class="container">
        <h1>Example - Employee Management System</h1>
        <EmployeeForm id="employeeForm" onAddOrEdit={this.onAddOrEdit} onCancel={this.onCancel} />
        <EmployeeListView
          id="employeeListView"
          model={this.state.employeeList}
          onEdit={this.onStartEdit}
          onDelete={this.onDelete}
        />
      </div>
    );
  }
}
