/**
 * Given a list of keys, retrieves them from durable object
 *
 * @param [String[]] keys - the array of keys
 *
 * @returns [Object] - a key-value object
 */
export async function getKeysValues(keys) {
  const res = await fetch(
    "https://cms-durable-object-prod.vittorio-dev.workers.dev/get",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(keys),
    }
  );

  const values = await res.json();

  return values;
}

/**
 * Given a list of key-value pairs, saves them in the durable object
 *
 * @param [Object[]] keys - the array of key-values. And entry is like this: {key:"key", value:"value"}
 *
 */
export async function putKeyValues(keyValues) {
  const res = await fetch(
    "https://cms-durable-object-prod.vittorio-dev.workers.dev/put?password=password",

    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(keyValues),
    }
  );
}

/** finds all elements with data-cf-key attribute and gets values for all keys */
export async function parsePage() {
  const keys = [];
  const elements = document.querySelectorAll("[data-cf-key]");
  elements.forEach((element) => {
    keys.push(element.dataset.cfKey);
  });

  const values = await getKeysValues(keys);

  return { values, elements };
}

/**
 * Generates html to update a text key
 *
 * @param [string] key - The key in the durable object
 * @param [string] value - The value associated with this key
 * @param [string] label - The human-readable label to display
 * @param [string] type - The input type
 *
 * @returns - a label, a text input and a button
 */
export function keyTextInputHtml(key, value, label, type = "text") {
  // create label
  const labelDiv = document.createElement("div");
  labelDiv.textContent = label;
  labelDiv.classList.add("label");

  // create input div
  const input = document.createElement("input");
  input.value = value;
  input.type = type;
  input.classList.add(`${type}-input`);

  // create save button
  const button = document.createElement("button");
  button.textContent = "save";
  button.dataset.cfKey = key;

  // save event listener
  button.addEventListener("click", async (e) => {
    e.stopPropagation();

    // add loading spinner
    e.target.classList.add("loading");

    // get key value
    const key = e.target.dataset.cfKey;
    const value = e.target.previousElementSibling.value;

    // save in durable object
    await putKeyValues([{ key, value }]);

    // remove asterisk and loading spinner
    e.target.classList.remove("loading", "asterisk");
  });

  // input edited event listener
  input.addEventListener("input", (e) => {
    const button = e.target.nextElementSibling;
    button.classList.add("asterisk");
  });

  return { labelDiv, input, button };
}

/**
 * Given an object that describes text input fields: {key:{label:"label", type:"type"}...}
 * gets the values from DO and creates all the html elements by running keyTextInputHtml.
 * Then inserts the elements inside targetElement.
 *
 * @param {Object} fields - the fields object
 * @param {Object} targetElement - the target html element where the fields will be inserted
 *
 * @returns - an array of elemets
 */
export async function createTextFields(fields, targetElement) {
  if (!fields) {
    targetElement.textContent = "This page has no editable fields";
    return;
  }

  const keys = Object.keys(fields);

  // get values from DO
  const values = await getKeysValues(keys);

  // create html elements
  const elements = [];
  for (const key of keys) {
    // get html
    const { labelDiv, input, button } = keyTextInputHtml(
      key,
      values[key],
      fields[key].label
    );

    // append to container
    targetElement.append(labelDiv, input, button);
  }
}

/**
 * Generates html to update an image key
 *
 * @param [string] key - The key in the durable object
 * @param [string] id - The id of the image
 * @param [string] variant - The variant of the image
 * @param [string] label - The human-readable label to display
 *
 * @returns - a label, a text input and a button
 */
export function keyImageInputHtml(key, id, variant, label) {
  // create label
  const labelDiv = document.createElement("div");
  labelDiv.textContent = label;
  labelDiv.classList.add("label");

  // create input div
  const img = document.createElement("img");
  img.src = `https://imagedelivery.net/gaTVTc0o1orPv9ZC5EE07g/${id}/w=80`;
  img.classList.add("select-image-thumbnail");

  // create select button
  const button = document.createElement("button");
  button.textContent = "Select";
  button.dataset.cfKey = key;
  button.dataset.cfVariant = variant;
  button.classList.add("select-image-button");

  // select event listener
  button.addEventListener("click", (event) => {
    const button = event.target;
    const key = button.dataset.cfKey;
    const variant = button.dataset.cfVariant;

    const imagesModal = document.getElementById("images-modal");
    imagesModal.dataset.selectedImageKey = key;
    imagesModal.dataset.selectedImageVariant = variant;
    imagesModal.classList.remove("hidden");
    document.getElementById("overlay").classList.remove("hidden");
  });

  return { labelDiv, img, button };
}

/**
 * Given an object that describes image input fields: {key:{label:"label", variant:"variant"}...}
 * gets the values from DO and creates all the html elements by running keyTextInputHtml.
 * Then inserts the elements inside targetElement.
 *
 * @param {Object} fields - the fields object
 * @param {Object} targetElement - the target html element where the fields will be inserted
 *
 * @returns - an array of elemets
 */
export async function createImageFields(fields, targetElement) {
  const keys = Object.keys(fields);

  // get values from DO
  const values = await getKeysValues(keys);
  console.log(values);

  // create html elements
  const elements = [];
  for (const key of keys) {
    if (values[key]) {
      // get html
      const { labelDiv, img, button } = keyImageInputHtml(
        key,
        values[key].id,
        values[key].variant,
        fields[key].label
      );

      // append to container
      targetElement.append(labelDiv, img, button);
    } else {
      // field not found in DO, image needs to be uploaded
      // get html with placeholder image
      const { labelDiv, img, button } = keyImageInputHtml(
        key,
        "16e411b5-8f66-4e2f-3f28-0a0daff2f100",
        "fit=scale-down",
        fields[key].label
      );

      // append to container
      targetElement.append(labelDiv, img, button);
    }
  }
}

/**
 * Update the thumbnail images of all the select image fields
 *
 */
export async function updateImageFields() {
  document.querySelectorAll(".select-image-thumbnail").forEach((element) => {
    const key = element.nextElementSibling.dataset.cfKey;

    getKeysValues([key]).then(async (values) => {
      const { id, variant } = values[key];
      element.src = `https://imagedelivery.net/gaTVTc0o1orPv9ZC5EE07g/${id}/w=80`;
    });
  });
}

/**
 * Given an object that describes an images, create a thumbnal for the images modal.
 */
export function createModalImageCardHtml(image) {
  // main div
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("image-card");
  mainDiv.dataset.imageId = image.id;

  // title
  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = image.filename;

  // image
  const img = document.createElement("img");
  img.src = `https://imagedelivery.net/gaTVTc0o1orPv9ZC5EE07g/${image.id}/w=80`;
  img.classList.add("image");

  mainDiv.append(img, title);

  // event listener
  mainDiv.addEventListener("click", async (e) => {
    const modal = document.getElementById("images-modal");
    const key = modal.dataset.selectedImageKey;
    const variant = modal.dataset.selectedImageVariant;
    const id = e.currentTarget.dataset.imageId;

    const res = await fetch(
      "https://cms-durable-object-prod.vittorio-dev.workers.dev/put?password=password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify([{ key, value: { id, variant } }]),
      }
    );

    updateImageFields();
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("images-modal").classList.add("hidden");
  });

  return mainDiv;
}

export async function populateImagesModal() {
  // get image keys from DO
  const values = await getKeysValues(["images"]);

  const images = values["images"].filter((image) => image);

  // populate modal
  const modalContainer = document.getElementById("images-modal-container");
  modalContainer.innerHTML = "";
  modalContainer.append(
    ...images.map((image) => createModalImageCardHtml(image))
  );
}

// adds a 0 to number below 9
export function addLeadingZero(n) {
  if (n > 9) {
    return `${n}`;
  } else {
    return `0${n}`;
  }
}

////////////
// EVENTS //
////////////
const modalCloseButton = document.getElementById("images-modal-close-button");

if (modalCloseButton) {
  modalCloseButton.addEventListener("click", (e) => {
    document.getElementById("overlay").classList.add("hidden");
    document.getElementById("images-modal").classList.add("hidden");
  });
}
