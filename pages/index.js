async function populateImages() {
  // initialize objects
  const keys = [];
  const variants = [];
  const ids = [];

  // get all elements and store key and variant
  const elements = document.querySelectorAll("[data-cf-key]");
  elements.forEach(async (element) => {
    keys.push(element.dataset.cfKey);
    variants.push(element.dataset.cfVariant);
  });

  // get image ids
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
  console.log(values);

  // update src
  elements.forEach((element, index) => {
    const key = keys[index];
    const variant = variants[index];

    if (values[key]) {
      const id = values[key].id;
      element.src = `https://imagedelivery.net/gaTVTc0o1orPv9ZC5EE07g/${id}/${variant}`;
    }
  });
}

async function populateFields() {
  // initialize objects
  const keys = [];
  const elements = [];

  // get all elements and store key and variant
  document.querySelectorAll("[data-cf-key]").forEach((element) => {
    if (element.tagName !== "IMG") {
      elements.push(element);
      keys.push(element.dataset.cfKey);
    }
  });

  // get values from DO
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

  // update src
  elements.forEach((element, index) => {
    const key = keys[index];

    if (values[key]) {
      element.textContent = values[key];
    }
  });
}

populateFields();
populateImages();
