import { Express } from "./lib/routes.js";
import { PORT, host } from "./lib/network.js";
import path from "node:path";
const app = new Express();
app.views(path.resolve("src", "public", "views"));

app.publicPath(path.resolve("src", "public"))

app.get("/", (_, res) => res.render())

app.get("/users/:userId", (_, res) => res.render("update.html") )

app.listen(PORT, () => {
    console.log(`Server is running ${host}`)
})