import {RouterModules} from "../decorator";
import {UserModule} from "./user/userModule";
import AppModules from "./app/appModule";

@RouterModules({
    debug: false,
    nodes: [AppModules,UserModule],
})
export default class AppRouter{}