import { FactoryInstance } from "../index"
import responseHeader from "./Header/header";
import AppRouter from "./router";

const port = 8080;
async function Applition() {
    const app = await FactoryInstance.create(AppRouter)
    app.listen(port, () => {
        console.log(`http://127.0.0.1:${port}`);
    })
    // use response Header
    app.server.use(responseHeader)
}

Applition()