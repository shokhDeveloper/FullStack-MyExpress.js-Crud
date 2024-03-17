import { userController } from "./controller/user.js";
import { host, SERVER_PORT } from "./lib/network.js";
import { Express } from "./lib/routes.js";

const app = new Express();

app.request("/", (req, res) => {
    res.end("ishladi")
})
app.request("/users", userController.GET);
app.request("/users/:userId", userController.GET);
app.request("/users", userController.POST, "POST");
app.request("/users/:userId", userController.PUT, "PUT");
app.request("/users/:userId", userController.DELETE, "DELETE");


app.listen(SERVER_PORT, () => {
    console.log(`Server is running ${host}`);
})