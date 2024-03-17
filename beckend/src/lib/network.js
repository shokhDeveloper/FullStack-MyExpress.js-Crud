import os from "node:os";
const networkInterface = os.networkInterfaces();
export let IP_ADRESS = "";
export const SERVER_PORT = process.env.PORT || "4000";
try{
    if(networkInterface["Беспроводная сеть 3"]){
        IP_ADRESS = (networkInterface["Беспроводная сеть 3"].find(item => item.family == "IPv4")).address
    }
}catch(error){
    throw new Error("Error to get Api Adress")
}
export const host = `http://${IP_ADRESS || "localhost"}:${SERVER_PORT}`;
