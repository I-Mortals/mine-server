import {Controller, Get, Post} from "../../index";
import {UserService} from "./service";
import {AppService} from "../app/service";
import {Request, Response} from "express";

@Controller("user")
export class User {
    constructor(readonly userService: UserService, readonly appService: AppService) {}

    @Get("get")
    public async getUser(req: Request, res: Response,) {
        res.send({
            user: this.userService.getMysql(),
            data: this.appService.getData()
        })
    }

    @Post("post")
    public async postUser(req: Request, res: Response,) {
        res.send(req.body)  
    }
}
