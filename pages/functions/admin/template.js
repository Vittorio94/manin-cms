export function getTemplate({ redirectPath, withError }) {
  return `
  <!doctype html>
  <html lang="en" data-theme="dark">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Password Protected Site</title>
      <meta name="description" content="This site is password protected.">
      <link rel="stylesheet" href="/styles.css" />
      <link rel="stylesheet" href="/elements.css" />


      <style>
        body {
          display: grid;
          grid-template-columns: auto;
          grid-template-rows: 1fr;
          justify-items: center;
          font-family: Arial, Helvetica, sans-serif;
          padding: 2rem 1rem;
          font-size:12pt;
        }

        form {
          display:grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          margin-top:1rem;
        }

        .error {
          background: white;
          border-radius: 10px;
          color: var(--red-1);
          padding: 0.5em 1em;
        }

        h2 { color: var(--color-h2); }
      </style>
    </head>

    <body>
      <h1>Admin</h1>
      <h2></h2>
      <div id="demo-disclamer"></div>
      ${
        withError
          ? `<p class="error">Incorrect password, please try again.</p>`
          : ""
      }
      <form method="post" action="/admin/cfp_login">
        <input type="hidden" name="redirect" value="${redirectPath}" />
        <input type="password" name="password" placeholder="Password" aria-label="Password" autocomplete="current-password" required autofocus>
        <button type="submit">Login</button>
      </form>
      <script>
        const urlParams=new URLSearchParams(window.location.search);
        const lang = urlParams.get("lang");

        if(lang==="EN"){
          document.querySelector("h2").textContent = "Please enter your password for this site"
          document.querySelector("#demo-disclamer").textContent = '(This is an open demo, the password is "password")'
        }
        else if(lang==="IT") {
          document.querySelector("h2").textContent = "Inserisci la password per questo sito"
          document.querySelector("#demo-disclamer").textContent = '(Questa è una demo aperta a tutti, la password è "password")'
        } else {
          document.querySelector("h2").textContent = "Please enter your password for this site"
          document.querySelector("#demo-disclamer").textContent = '(This is an open demo, the password is "password")'
        }

      </script>
    </body>

  </html>
  `;
}
