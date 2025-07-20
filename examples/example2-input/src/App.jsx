import { WebMVCComponent } from "web-mvc-js";
import { CounterDisplay } from "./CounterDisplay";
import { CounterButton } from "./CounterButton";
import { CounterModel } from "./CounterModel";
import { CounterInputField } from "./CounterInputField";

export class App extends WebMVCComponent {
  constructor() {
    const model = new CounterModel();
    super({ model });
    this.model = model;

    this.model.addListener((property, newValue, oldValue) => this.update(property, newValue, oldValue));
  }

  updateUserPreview = () => {
    this.refs.userPreview.innerHTML = `
      <strong>Display Name:</strong> ${this.model.name}<br>
      <strong>Email:</strong> ${this.model.email}<br>
      <strong>Age:</strong> ${this.model.age}<br>
      <strong>Status:</strong> ${this.model.isActive ? "Active" : "Inactive"}<br>
      <strong>Valid:</strong> ${this.model.validate() ? "✅ Yes" : "❌ No"}
    `;
  };

  fillSampleData = () => {
    this.model.name = "John Doe";
    this.model.email = "john.doe@example.com";
    this.model.age = 30;
    this.model.isActive = true;
  };

  clearUserData() {
    this.model.name = "";
    this.model.email = "";
    this.model.age = 0;
    this.model.isActive = false;
  }

  validateUser() {
    const isValid = this.model.validate();
    alert(`User validation: ${isValid ? "Valid" : "Invalid"}`);
  }

  // Helper functions
  logChange(property, newValue, oldValue) {
    const log = this.refs.logChange;
    const timestamp = new Date().toLocaleTimeString();
    log.innerHTML += `<div>[${timestamp}] ${this.model.constructor.name}.${property}: "${oldValue}" → "${newValue}"</div>`;
    log.scrollTop = log.scrollHeight;
  }

  clearLog() {
    this.refs.logChange.innerHTML = "";
  }

  update(property, newValue, oldValue) {
    console.log(`App.update(): property:${property} new=${newValue} old=${oldValue}`);
    console.log(`App.update() allRefs: `, this.allRefs);

    try {
      if (property === "count") {
        this.childComponents["counter-input"].refs.counterInput.value = Number(newValue); // Update input value directly
      } else if (property === "name") {
        this.childComponents["name-input"].refs.nameInput.value = newValue; // Update name input value directly
      } else if (property === "email") {
        this.childComponents["email-input"].refs.emailInput.value = newValue; // Update email input value directly
      } else if (property === "age") {
        this.refs.ageInput.value = newValue; // Update age input value directly
      } else if (property === "isActive") {
        this.refs.activeCheckbox.checked = newValue; // Update active checkbox directly
      }

      this.updateUserPreview(); // Update user preview with new values
      this.logChange(property, newValue, oldValue);
    } catch (error) {
      console.error("Error updating input fields:", error);
      console.error("Available refs:", this.refs);
    }
  }

  afterMount() {
    this.updateUserPreview();
  }

  render() {
    console.log("App render() called");
    return (
      <div class="container">
        <h1>Example 2 - Input fields</h1>
        <div class="demo-section">
          <h2>Counter Section</h2>
          <CounterDisplay model={this.model} />
          <CounterInputField
            type="number"
            id="counter-input"
            refName="counterInput"
            label="Count Input Value:"
            value={this.model.count}
            model={this.model}
            onInput={(newValue) => this.model.setCount(newValue)}
          />
          <CounterButton label="Increment" id="increment-button" onClick={() => this.model.increment()} />
          <CounterButton label="Decrement" id="decrement-button" onClick={() => this.model.decrement()} />
          <CounterButton label="Reset" id="reset-button" onClick={() => this.model.reset()} />
          <CounterButton label="Random" id="random-button" onClick={() => this.model.random()} />
        </div>
        <div class="demo-section">
          <CounterInputField
            type="text"
            id="name-input"
            refName="nameInput"
            label="Name:"
            model={this.model}
            onInput={(newValue) => this.model.setName(newValue)}
          />
          <CounterInputField
            type="text"
            id="email-input"
            refName="emailInput"
            label="Email:"
            model={this.model}
            onInput={(newValue) => (this.model.email = newValue)}
          />
          <div class="form-group">
            <label for="user-age">Age:</label>
            <input
              type="number"
              id="user-age"
              min="0"
              max="120"
              ref="ageInput"
              onInput={(e) => (this.model.age = e.target.value)}
            />
          </div>

          <div class="form-group">
            <div class="checkbox-group">
              <input
                type="checkbox"
                id="user-active"
                ref="activeCheckbox"
                model={this.model}
                onInput={(e) => (this.model.isActive = e.target.checked)}
                //value={this.props.model.isActive ? "yes" : "no"}
                checked={this.model.isActive}
              />
              <label for="user-active">Active User</label>
            </div>

            <button onclick={() => this.fillSampleData()}>Fill Sample Data</button>
            <button onclick={() => this.clearUserData()}>Clear All</button>
            <button onclick={() => this.validateUser()}>Validate</button>

            <div class="output">
              <h3>User Preview:</h3>
              <div class="user-preview" id="user-preview" ref="userPreview"></div>
            </div>
          </div>

          <div class="demo-section">
            <h2>Change Log</h2>
            <button onclick="clearLog()">Clear Log</button>
            <div class="log" id="change-log" ref="logChange">
              <div>
                <strong>Listeners Demo:</strong>
              </div>
              <div>• Counter turns red when &gt; 50</div>
              <div>• Alert when counter reaches 100</div>
              <div>• Email validation warnings</div>
              <div>• Age category notifications</div>
              <div>• Name length warnings</div>
              <div>---</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
