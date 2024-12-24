import {Injectable} from "../../index";

@Injectable()
export class AppService {
    public async getData() {
        console.log("AppService")
        return "AppService"
    }
}
