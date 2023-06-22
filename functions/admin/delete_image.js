export async function onRequestPost(context) {
  const { request, env } = context;

  // get request body
  //const imageIds = await request.json();
  const imageIds = await request.json();

  let res, json;
  const promises = [];
  for (const imageId of imageIds) {
    promises.push(
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/63e232b8caf4359470ef1d706472cdce/images/v1/${imageId}`,
        {
          headers: {
            Authorization: "Bearer h0lFsLrGjHa-iqxs7SD8R0n103J5OeczyXTzUDEr",
          },
          method: "DELETE",
        }
      )
    );
  }

  // get images list
  res = await fetch(
    "https://restaurant-durable-object.vittorio-dev.workers.dev/get",
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
  const images = JSON.parse(json.images).filter(
    (image) => image && !imageIds.includes(image.id)
  );

  // update image list
  res = await fetch(
    "https://restaurant-durable-object.vittorio-dev.workers.dev/put?password=password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify([{ key: "images", value: JSON.stringify(images) }]),
    }
  );

  return new Response("success");
}
