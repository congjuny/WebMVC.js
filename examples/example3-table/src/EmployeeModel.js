import { WebMVCModel } from "web-mvc-js";

export class EmployeeModel extends WebMVCModel {
  constructor(data = {}) {
    super({
      id: null,
      name: "",
      email: "",
      position: "",
      salary: 0,
      ...data, // Spread operator to initialize with provided data
    });
  }

  setName(newName) {
    this.name = newName;
  }

  setEmail(newEmail) {
    this.email = newEmail;
  }

  setPosition(newPosition) {
    this.position = newPosition;
  }

  setSalary(newSalary) {
    if (typeof newSalary === "string") {
      newSalary = parseFloat(newSalary);
      //newSalary = isNaN(newSalary) ? 0 : newSalary.toFixed(2); // Ensure it's a valid number
    }
    this.salary = newSalary;
  }

  reset() {
    this.id = null;
    this.name = "";
    this.email = "";
    this.position = "";
    this.salary = 0;
  }

  setAllFields(employee) {
    this.name = employee?.name;
    this.email = employee?.email;
    this.position = employee?.position;
    this.salary = employee?.salary;
    this.id = employee?.id; // Ensure the ID is set for editing
  }

  validate() {
    const isValid = this.name?.length > 0 && this.email?.includes("@");
    return isValid;
  }
}
