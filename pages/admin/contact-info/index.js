import {
  createTextFields,
  getKeysValues,
  keyTextInputHtml,
  parsePage,
} from "../utils.js";

// global state object
const state = {
  textFields: {
    phone: { label: "Phone:", type: "text" },
    address: { label: "Address:", type: "text" },
    iva: { label: "Iva:", type: "text" },
  },
};

const container = document.getElementById("text-fields-container");
createTextFields(state.textFields, container);
