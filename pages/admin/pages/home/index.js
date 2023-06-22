import {
  createTextFields,
  createImageFields,
  populateImagesModal,
} from "../../utils.js";

// global state object
const state = {
  imageFields: {
    "home-history-image": { label: "History", variant: "fit=scale-down" },
    "home-specials-image-1": {
      label: "Specials image 1",
      variant: "fit=scale-down",
    },
    "home-specials-image-2": {
      label: "Specials image 2",
      variant: "fit=scale-down",
    },
    "home-specials-image-3": {
      label: "Specials image 3",
      variant: "fit=scale-down",
    },
    "home-chef-image": {
      label: "Chef image",
      variant: "fit=scale-down",
    },
  },
};

createTextFields(
  state.textFields,
  document.getElementById("text-fields-container")
);
createImageFields(
  state.imageFields,
  document.getElementById("image-fields-container")
);

populateImagesModal();
