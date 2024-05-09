import {Injectable} from "../../decorator";

@Injectable()
export class UserService {
    public async getMysql() {
        return " mysql data"
    }
}