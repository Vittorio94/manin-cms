export async function onRequestPost(context) {
  const { request, env } = context;

  // get request body
  const data = await request.formData();

  let res, json;

  // get upload url
  res = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/63e232b8caf4359470ef1d706472cdce/images/v2/direct_upload",
    {
      headers: {
        Authorization: `Bearer ${env.IMAGES_API_TOKEN}`,
      },
      method: "POST",
    }
  );
  json = await res.json();
  const url = json.result.uploadURL;

  // upload image
  res = await fetch(url, {
    method: "POST",
    body: data,
  });
  json = await res.json();
  const image = json.result;
  console.log(json);

  // get images list
  res = await fetch(
    "https://cms-durable-object-prod.vittorio-dev.workers.dev/get",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(["images"]),
    }
  );
  json = await res.json();
  let images;
  if (json["images"]) {
    images = json.images;
  } else {
    images = [];
  }

  images.push(image);

  // update image list
  res = await fetch(
    "https://cms-durable-object-prod.vittorio-dev.workers.dev/put?password=password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify([{ key: "images", value: images }]),
    }
  );

  return new Response("success");
}
