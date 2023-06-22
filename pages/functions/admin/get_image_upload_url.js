export async function onRequestPost(context) {
  const { request, env } = context;

  const body = new FormData();
  body.append("requireSignedURLs", "true");
  body.append("", "\\");
  body.append("metadata", '{"key":"value"}');

  const res = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/63e232b8caf4359470ef1d706472cdce/images/v2/direct_upload",
    {
      headers: {
        Authorization: "Bearer h0lFsLrGjHa-iqxs7SD8R0n103J5OeczyXTzUDEr",
      },
      method: "POST",
    }
  );
  const json = await res.json();

  console.log(json);

  return new Response(JSON.stringify(json));
}
