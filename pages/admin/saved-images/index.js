import { getKeysValues } from "../utils.js";

/**
 * Creates a card given an image
 */
function imageCardHtml(image) {
  // main div
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("image-card");

  // title
  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = image.filename;

  // delete button
  const delButton = document.createElement("button");
  delButton.classList.add("delete-button");
  delButton.textContent = "x";
  delButton.dataset.imageId = image.id;
  delButton.addEventListener("click", async (e) => {
    e.stopPropagation();

    // add loading spinner
    e.target.classList.add("loading");

    const imageId = delButton.dataset.imageId;
    let res;
    let text;
    const data = [imageId];
    res = await fetch("/admin/delete_image", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        //"Content-Type": "multipart/form-data",
      },
    });
    text = await res.text();

    loadAllImages();

    // remove loading spinner
    e.target.classList.remove("loading");
  });

  // image
  const img = document.createElement("img");
  img.src = `https://imagedelivery.net/gaTVTc0o1orPv9ZC5EE07g/${image.id}/w=200`;
  img.classList.add("image");

  //mainDiv.append(img, delButton, title);
  mainDiv.append(img, title);

  return mainDiv;
}

async function setUploadUrl() {
  const res = await fetch("/admin/get_image_upload_url", { method: "POST" });
  const json = await res.json();
  const url = json.result.uploadURL;

  document.getElementById("upload-image-form").action = url;
}

async function loadAllImages() {
  // get image keys from DO
  const values = await getKeysValues(["images"]);
  let images;
  if (!values["images"]) {
    images = [];
  } else {
    images = JSON.parse(values["images"]).filter((image) => image);
  }

  // create image cards
  const savedContainer = document.getElementById("saved-images-container");
  savedContainer.innerHTML = "";
  savedContainer.append(...images.map((image) => imageCardHtml(image)));
}

/////////////////
// RUN SCRIPTS //
/////////////////

loadAllImages();
setUploadUrl();

////////////
// EVENTS //
////////////

// user submits upload image form
document
  .getElementById("upload-image-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    let res, text;

    // show loading spinner
    const button = document.getElementById("submit-button");
    button.classList.add("loading");

    // upload image
    const data = new FormData(document.getElementById("upload-image-form"));
    res = await fetch("/admin/upload_image", {
      method: "POST",
      body: data,
      headers: {
        //"Content-Type": "multipart/form-data",
      },
    });
    text = await res.text();

    // reload images
    loadAllImages();

    // remove loading spinner
    button.classList.remove("loading");
  });
