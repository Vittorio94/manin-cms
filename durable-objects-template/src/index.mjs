import { getCookieKeyValue } from "./utils";

// cors headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  //"Access-Control-Allow-Origin": "http://127.0.0.1:8788",
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

const defaultState = {
  phone: "1234567891",
  address: "Via Verdi 1, Vicenza (VI)",
  iva: "987654321",
  "home-history-image": {
    id: "565ad6df-cd49-4769-2153-aafadcd09b00",
    variant: "fit=scale-down",
  },
  "home-specials-image-2": {
    id: "39268c73-e4bd-4682-35b2-84e9e110e600",
    variant: "fit=scale-down",
  },
  "home-specials-image-3": {
    id: "841c0ae3-63e4-43a7-11c8-932378c76900",
    variant: "fit=scale-down",
  },
  "home-chef-image": {
    id: "7a7c98b2-096a-45ab-5e4a-fb6fca426c00",
    variant: "fit=scale-down",
  },
};

// Worker entry point
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // get password form url
    let url = new URL(request.url);
    const password = url.searchParams.get("password");

    // handle request
    return await handleRequest(request, env);
  },
};

async function handleRequest(request, env) {
  // Every unique ID refers to an individual instance of the Counter class that
  // has its own state. `idFromName()` always returns the same ID when given the
  // same string as input (and called on the same class), but never the same
  // ID for two different strings (or for different classes).

  let id = env.CMS_DATA.idFromName(env.DO_NAME);
  let obj = env.CMS_DATA.get(id);

  // send request to DO
  return await obj.fetch(request);
}

// Durable Object
export class Data {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    // get request url
    let url = new URL(request.url);
    let pathName = url.pathname;
    const password = url.searchParams.get("password");

    // create alarm if it doesn't exist
    await this.createAlarm();

    if (pathName === "/get") {
      // get request body
      const body = await request.json();
      // get keys from DO. This endpoint is not password protected.
      try {
        // body must be a list of key strings
        const keys = body;

        // get values from DO
        const promises = [];
        for (const key of keys) {
          promises.push(this.state.storage.get(key));
        }
        const values = await Promise.all(promises);

        const resBody = {};
        for (let i = 0; i < keys.length; i++) {
          resBody[keys[i]] = values[i];
        }

        return new Response(JSON.stringify(resBody), {
          status: 200,
          headers: corsHeaders,
        });
      } catch (error) {
        return new Response(`Error getting values from DO: ${error.message}`, {
          status: 500,
          headers: corsHeaders,
        });
      }
    }
    if (pathName === "/put" && password === this.env.CFP_PASSWORD) {
      // get request body
      const body = await request.json();
      try {
        const keyValues = body;
        const promises = [];
        for (const keyValue of keyValues) {
          if (keyValue.key !== "images") {
            // DEMO WEBSITE: only update key if it is not the "images" key
            promises.push(this.state.storage.put(keyValue.key, keyValue.value));
          }
        }
        await Promise.all(promises);

        return new Response("success", { status: 200, headers: corsHeaders });
      } catch (error) {
        return new Response(`Error putting values in DO: ${error.message}`, {
          status: 500,
          headers: corsHeaders,
        });
      }
    } else if (pathName === "/track") {
      // get request body
      const body = await request.json();

      // track user
      const country = request.cf.country;
      const ip = request.headers.get("cf-connecting-ip");
      const pathName = body.pathName;
      const referrer = body.referrer;

      // make sure referrer is not localhost
      if (referrer.includes("127.0.0.1")) {
        return new Response(
          "You are running locally, your page views will not be tracked",
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      // make sure pathName is one of the pages of the website
      if (!this.env.PATHNAMES.includes(pathName)) {
        return new Response(
          "Trying to track a page that does not exist on this website",
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      // make sure country string is maximum 3 letters
      if (country.length > 3) {
        return new Response("Invalid country", {
          status: 500,
          headers: corsHeaders,
        });
      }

      // start transaction
      let transactionRes;
      try {
        transactionRes = await this.state.storage.transaction(async (txn) => {
          let res;

          const date = new Date();
          let dateStr =
            date.getFullYear() +
            "-" +
            addLeadingZero(date.getMonth() + 1) +
            "-" +
            addLeadingZero(date.getDate());

          // get analytics key
          res = await txn.get("analytics");
          let analytics;
          if (res) {
            analytics = res;
          } else {
            // create analytics if they don't exist
            analytics = {};
          }
          // get current date data
          let dateObj;
          if (analytics[dateStr]) {
            dateObj = analytics[dateStr];
          } else {
            // initialize date object if this is the first visit of the day
            dateObj = {
              pathNames: {},
              referrers: {},
              countries: {},
            };
          }

          // update pathNames
          if (dateObj.pathNames[pathName]) {
            if (dateObj.pathNames[pathName][ip]) {
              dateObj.pathNames[pathName][ip]++;
            } else {
              dateObj.pathNames[pathName][ip] = 1;
            }
          } else {
            dateObj.pathNames[pathName] = {};
            dateObj.pathNames[pathName][ip] = 1;
          }

          // update referres
          if (dateObj.referrers[referrer]) {
            if (dateObj.referrers[referrer][ip]) {
              dateObj.referrers[referrer][ip]++;
            } else {
              dateObj.referrers[referrer][ip] = 1;
            }
          } else {
            dateObj.referrers[referrer] = {};
            dateObj.referrers[referrer][ip] = 1;
          }

          // update countries
          if (dateObj.countries[country]) {
            if (dateObj.countries[country][ip]) {
              dateObj.countries[country][ip]++;
            } else {
              dateObj.countries[country][ip] = 1;
            }
          } else {
            dateObj.countries[country] = {};
            dateObj.countries[country][ip] = 1;
          }

          // store in DO
          analytics[dateStr] = dateObj;
          res = await txn.put("analytics", analytics);
          return dateObj;
        });
        console.log(transactionRes);
        return new Response(JSON.stringify(transactionRes), {
          "content-type": "application/json;charset=UTF-8",
          headers: corsHeaders,
        });
      } catch (error) {
        return new Response(error.message, {
          status: 500,
          headers: corsHeaders,
        });
      }
    } else if (pathName === "/clear") {
      // clearing analytics key
      try {
        const res = await this.state.storage.put("analytics", {});
        return new Response(`analytics cleared successfully`, {
          status: 200,
          headers: corsHeaders,
        });
      } catch (error) {
        return new Response(`Error clearing analytics: ${error.message}`, {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    return new Response("invalid pathName", {
      status: 404,
      headers: corsHeaders,
    });
  }

  async createAlarm() {
    const currentAlarm = await this.state.storage.getAlarm();
    if (currentAlarm == null) {
      // set 5 minutes alarm
      this.state.storage.setAlarm(Date.now() + 10 * 60 * 1000);
    }
  }

  async alarm() {
    // revert keys back to default
    const promises = [];
    for (const key of Object.keys(defaultState)) {
      promises.push(this.state.storage.put(key, defaultState[key]));
    }
    await Promise.all(promises);

    // set new alarm
    this.state.storage.setAlarm(Date.now() + 10 * 60 * 1000);
  }
}

// adds a 0 to number below 9
function addLeadingZero(n) {
  if (n > 9) {
    return `${n}`;
  } else {
    return `0${n}`;
  }
}
