export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  console.log(body);

  // setting key value pairs
  const keys = Object.keys(body);

  // getting durable object
  const id = context.env.RESTAURANT_DATA.idFromName("data");
  const obj = context.env.RESTAURANT_DATA.get(id);

  const promises = [];
  for (const key of keys) {
    const req = new Request();
    const resp = obj.fetch();
    promises.push(env.RESTAURANT_WEBSITE.put(key, body[key]));
  }

  await Promise.all(promises);

  return new Response("", { status: 200 });
}
