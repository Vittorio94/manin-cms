import { getCookieKeyValue } from "./utils";
import { getTemplate } from "./template";

async function authentication(context) {
  console.log("authenticating");
  const { request, next, env } = context;
  const { pathname, searchParams } = new URL(request.url);
  const { error } = Object.fromEntries(searchParams);
  const cookie = request.headers.get("cookie") || "";
  const cookieKeyValue = await getCookieKeyValue(env.CFP_PASSWORD);

  console.log(cookie.includes(cookieKeyValue));
  console.log(!env.CFP_PASSWORD);

  if (
    cookie.includes(cookieKeyValue) ||
    !env.CFP_PASSWORD ||
    pathname === "/admin/cfp_login"
  ) {
    // Correct hash in cookie, allowed path, or no password set.
    // Continue to next middleware.
    return await next();
  } else {
    // No cookie or incorrect hash in cookie. Redirect to login.
    return new Response(
      getTemplate({ redirectPath: "/admin/", withError: error === "1" }),
      {
        headers: {
          "content-type": "text/html",
        },
      }
    );
  }
}

async function rewrite(context) {
  const { request, next, env } = context;
  console.log("rewriting");

  const response = await next();

  //return new HTMLRewriter().on("h1", new ElementHandler()).transform(response);
  return new HTMLRewriter()
    .on("[data-vitto-key]", {
      async element(element) {
        console.log("element");
        const key = element.getAttribute("data-vitto-key");
        const res = await fetch(
          "https://restaurant-durable-object.vittorio-dev.workers.dev/get",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ key }),
          }
        );

        const value = (await res.text()) || "";

        console.log(key, value);
        const string = "1243";
        element.setAttribute("value", value);
      },
    })
    .transform(response);
}

class ElementHandler {
  element(element, env) {}
}

async function handleElement(element, env) {
  console.log("element");
  const key = element.getAttribute("data-vitto-key");
  const value = await env.RESTAURANT_DATA.get(key);
  console.log(key, value);
  element.setAttribute("value", value);
}

//export const onRequest = [authentication, rewrite];
export const onRequest = [authentication];
