async function rewrite(context) {
  const { request, next, env } = context;
  console.log("rewriting");

  const response = await next();
  return response;

  //return new HTMLRewriter().on("div", new ElementHandler()).transform(response);
}

class ElementHandler {
  element(element) {
    // An incoming element, such as `div`
    console.log(`Incoming element: ${element.tagName}`);
  }

  comments(comment) {
    // An incoming comment
  }

  text(text) {
    // An incoming piece of text
  }
}
export const onRequest = [rewrite];
