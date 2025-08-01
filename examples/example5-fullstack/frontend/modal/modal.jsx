// modal.jsx
import "./modal.css";
import { WebMVCComponent } from "web-mvc-js";

// Basic modal structure (internal)
class Modal extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.props = props || {};
    this.isOpen = props?.isOpen || false;
    this.onClose = props?.onClose || (() => {});
    this.children = props?.children || null;
  }

  handleBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      this.onClose();
    }
  };

  render() {
    return (
      <div class={`modal-overlay ${this.isOpen ? "active" : ""}`} onclick={(e) => this.handleBackgroundClick(e)}>
        <div class="modal-content" onclick={(e) => e.stopPropagation()}>
          {/* <button class="modal-close" onclick={this.onClose}></button> */}
          {this.children}
        </div>
      </div>
    );
  }
}

// Inject modals directly into DOM when needed
let modalRoot = document.createElement("div");
document.body.appendChild(modalRoot);

export class AlertModal extends WebMVCComponent {
  constructor(props) {
    super(props);
  }

  handleOk = () => {
    this.props.onOk?.();
    cleanup();
  };

  render() {
    return (
      <Modal isOpen={true} onClose={this.props.onClose}>
        <h2>{this.props.title || "Alert"}</h2>
        <p>{this.props.message}</p>
        <button onclick={this.handleOk}>OK</button>
      </Modal>
    );
  }
}

export class ConfirmModal extends WebMVCComponent {
  constructor(props) {
    super(props);
  }

  handleOk = () => {
    this.props.onConfirm?.();
    cleanup();
  };
  handleCancel = () => {
    this.props.onCancel?.();
    cleanup();
  };

  render() {
    console.log("Rendering ConfirmModal, isOpen =", this.props.isOpen);
    if (!this.props.isOpen) {
      return null; // Don't render if not open
    }

    console.log("ConfirmModal is open, rendering content");
    console.log("ConfirmModal props:", this.props);
    console.log("ConfirmModal onClose:", this.props.onClose);

    return (
      <Modal isOpen={true} onClose={this.props.onClose}>
        <h2>{this.props.title || "Confirm"}</h2>
        <p>{this.props.message}</p>
        <div class="modal-buttons">
          <button onclick={() => this.handleCancel()}>Cancel</button>
          <button onclick={() => this.handleOk()}>OK</button>
        </div>
      </Modal>
    );
  }
}

export class PromptModal extends WebMVCComponent {
  constructor(props) {
    super(props);
    this.inputValue = props?.defaultValue || "";
  }

  handleInputChange = (e) => {
    this.inputValue = e.target.value;
  };

  handleOk = () => {
    this.props.onConfirm?.(this.inputValue);
    cleanup();
  };

  render() {
    return (
      <Modal isOpen={true} onClose={this.props.onClose}>
        <h2>{this.props.title || "Prompt"}</h2>
        <input type="text" value={this.inputValue} onInput={this.handleInputChange} />
        <div class="modal-buttons">
          <button onclick={this.props.onCancel}>Cancel</button>
          <button onclick={this.handleOk}>OK</button>
        </div>
      </Modal>
    );
  }
}

function cleanup() {
  modalRoot.innerHTML = "";
}
