export async function onRequestPost(context) {
  console.log("HII");
  const { request, env } = context;
  const body = await request.json();
  console.log(body);

  // setting key value pairs
  const keys = Object.keys(body);

  // getting durable object
  const id = context.env.RESTAURANT_DATA.idFromName("data");
  const obj = context.env.RESTAURANT_DATA.get(id);

  const res = await obj.fetch(request);

  return res;
}
