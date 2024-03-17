import fs from "node:fs/promises";
import path from "node:path";
export const readFile = async (fileName) => {
    let data = await fs.readFile( path.join(process.cwd(), "database", "users.json") )
    data = data ? JSON.parse(data): [];
    return data;
}