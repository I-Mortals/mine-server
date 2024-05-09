import {UserService} from "./service";
import {AppService} from "../app/service";
import {User} from "./user";
import {Modules} from "../../decorator";

@Modules({
    controller: User,
    providers: [UserService, AppService],
})
export class UserModule {}