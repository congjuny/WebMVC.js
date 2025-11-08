//import { WebMVCModel } from "web-mvc-js";

export class EmployeeModel {
  constructor(employee) {
    if (employee) {
      this.name = employee.name;
      this.email = employee.email;
      this.position = employee.position;
      this.salary = employee.salary;
      this.isActive = employee.isActive;
    }
  }

  setName(newName) {
    console.log("EmployeeModel.setName(): ", newName);
    this.name = newName;
  }

  setEmail(newEmail) {
    console.log("EmployeeModel.setEmail(): ", newEmail);
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

  setIsActive(argIsActive) {
    this.isActive = argIsActive;
  }

  reset() {
    this.id = null;
    this.name = "";
    this.email = "";
    this.position = "";
    this.salary = 0;
    this.isActive = false;
  }

  setAllFields(employee) {
    this.name = employee?.name;
    this.email = employee?.email;
    this.position = employee?.position;
    this.salary = employee?.salary;
    this.id = employee?.id; // Ensure the ID is set for editing
    this.isActive = employee?.isActive;
  }

  validate() {
    const isValid = this.name?.length > 0 && this.email?.includes("@");
    console.log("EmployeeModel validate: ", this);
    return isValid;
  }
}
