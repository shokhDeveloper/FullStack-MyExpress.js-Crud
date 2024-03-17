import http from "node:http"
import path from "node:path"
import fs from "node:fs/promises";
const handler = {}
let views = null;
let publicPath = null;
const Server = (req, res) => {
    const SERVER_URL = new URL(req.url, `http://${req.headers.host}`);
    const reqUrl = SERVER_URL.pathname.toLowerCase();
    const reqMethod = req.method.toUpperCase();

    res.render = async function(fileName){
        res.writeHead(200, {"Content-type": "text/html"});
        res.end(await fs.readFile(path.join(views, fileName ? fileName : "index.html")))
    }
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

    if(handler[reqUrl] && reqMethod == "GET"){
        return handler[reqUrl][reqMethod](req, res)
    }else if(!handler[reqUrl] && reqMethod == "GET"){
        return handleRenderFile(reqUrl, req, res)
    }else{
        return res.end("Not found")
    }
}
async function handleRenderFile (reqUrl, req, res) {
    let extName = path.extname(reqUrl)
    const contentTypes = {
        ".js": "application/js",
        ".css": "text/css",
        ".html": "text/html"
    }
    try{
        if(contentTypes[extName]){
            let contentType = {"Content-type": contentTypes[extName]}
            let file = await fs.readFile(path.join(publicPath, reqUrl))
            res.writeHead(200, contentType)
            res.end(file)
            return true
        }else{
            res.end(`Not found ${contentTypes[extName]} `)
        }
    }catch(error){
        console.log(error)  
    }
}
function isMatchedWithRegex(regex, reqUrl) {
  reqUrl += reqUrl[reqUrl.length - 1] == "/" ? "" : "/";
  return reqUrl.match(regex) !== null ? true : false;
} 
function isPathWithParams (reqUrl) {
    const regex = /\/:.?/;
    return regex.test(reqUrl)
}

function RegexGenerator (reqUrl) {
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

}
export class Express {
    constructor(){
       this.server = http.createServer(Server);
       this.views = function(path){
        views = path;
       };
       this.publicPath = function(path){
        publicPath = path
       }
       this.get = function(reqUrl, callbackHandler){
        handler[reqUrl] = handler[reqUrl] || {};
        handler[reqUrl]["GET"] = callbackHandler;
        if(isPathWithParams(reqUrl)) handler[reqUrl]["path"] = RegexGenerator(reqUrl)
       }
       this.listen = function(PORT, callbackHandler){
        this.server.listen(PORT, callbackHandler)
       }
    }
}