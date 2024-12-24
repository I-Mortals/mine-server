import {AppService} from "./service";
import {AppController} from "./app";
import {Modules} from "../../index";

@Modules({
    controller: AppController,
    providers: [AppService],
})
export default class AppModules { }