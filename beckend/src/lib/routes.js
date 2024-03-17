import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
const handler = {};
const BASIC_REQUESTS = ["PUT", "POST", "DELETE", "PATCH"];
const Server = (req, res) => {
  const SERVER_URL_CONSTRUCTOR = new URL(req.url, `http://${req.headers.host}`);
  const reqUrl = SERVER_URL_CONSTRUCTOR.pathname.toLowerCase();
  const reqMethod = req.method.toUpperCase();
  let searchParams = SERVER_URL_CONSTRUCTOR.searchParams.entries();
  searchParams = Object.fromEntries(searchParams);
  req.searchParams = Object.keys(searchParams).length ? searchParams : null;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  
  if(reqMethod == "OPTIONS") return res.end("")

  if (BASIC_REQUESTS.includes(reqMethod)) {
    req.body = new Promise((resolve) => {
      let data = "";
      req.on("data", (buffer) => (data += buffer));
      req.on("end", () => {
        if (!data) {
          resolve(false);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  res.toAddDatabase = async function (data, fileName) {
    await fs.writeFile(
      path.join(process.cwd(), "database", `${fileName}.json`),
      JSON.stringify(data, null, 4)
    );
  };

  res.setJSON = function (data, statusCode) {
    res.writeHead(statusCode, { "Content-type": "application/json" });
    res.end(JSON.stringify(data));
  };

  res.json = function (data) {
    res.setHeader("Content-type", "application.json");
    res.end(JSON.stringify(data));
  };
  const params = {};
  for (let key in handler) {
    if ("path" in handler[key]) {
      if (isMatchedWithRegex(handler[key].path, reqUrl)) {
        let keys = key
          .split("/:")
          .filter((item) => item !== "")
          .slice(1);
        let values = reqUrl
          .split("/")
          .filter((item) => item !== "")
          .slice(1);
        keys.map((key, index) => (params[key] = values[index]));
        req.params = params;
        return handler[key][reqMethod](req, res);
      }
    }
  }

  if (handler[reqUrl]) {
    handler[reqUrl][reqMethod](req, res);
  }
};

function isMatchedWithRegex(regex, reqUrl) {
  reqUrl += reqUrl[reqUrl.length - 1] == "/" ? "" : "/";
  return reqUrl.match(regex) !== null ? true : false;
}

const RegexGenerator = (reqUrl) => {
  let res = "";
  let params = "\\b.*?/";
  let ind = false;

  for (let i = 0; i < reqUrl.length; i++) {
    if (reqUrl[i] == ":") {
      res += params;
      ind = true;
    } else if (reqUrl == "/" && ind) {
      ind = false;
    } else if (ind) {
      continue;
    } else {
      res += reqUrl[i];
    }
  }

  let regex = new RegExp(res, "gis");
  return regex;
};

function isPathWithParams(path) {
  let regex = /\/:.*?/g;
  return regex.test(path);
}

export class Express {
  constructor() {
    this.server = http.createServer(Server);
    this.request = function (reqUrl, callBackHandler, reqMethod) {
      handler[reqUrl] = handler[reqUrl] || {};
      handler[reqUrl][!reqMethod ? "GET" : reqMethod] = callBackHandler;
      if (isPathWithParams(reqUrl))
        handler[reqUrl]["path"] = RegexGenerator(reqUrl);
    };
    this.listen = function (PORT, callBackHandler) {
      this.server.listen(PORT, callBackHandler);
    };
  }
}
