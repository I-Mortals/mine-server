import {Injectable} from "../../index";

@Injectable()
export class AppService {
    getData() {
        console.log("AppService")
        return "AppService"
    }
}
@Injectable()
export class TestService {
    getData() {
        console.log("TestService")
    }
}
