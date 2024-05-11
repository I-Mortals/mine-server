import {AppService, TestService} from "./service";
import {AppController} from "./app";
import {Modules} from "../../index";

@Modules({
    controller: AppController,
    providers: [TestService, AppService],
})
export default class AppModules { }