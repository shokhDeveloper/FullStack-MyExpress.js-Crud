import os from "node:os";
const networkInterface = os.networkInterfaces();
let API_ADRESS = ""
export let PORT = 5000
try{
    if(networkInterface["Беспроводная сеть 3"]){
        API_ADRESS = networkInterface["Беспроводная сеть 3"].find(network => network.family == "IPv4").address
    }
}catch(error){
    console.log("Error GET to API ADRESS")
}

export const host = `http://${API_ADRESS || "localhost"}:${PORT}`