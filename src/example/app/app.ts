
import {Controller, Get, Upload} from "../../decorator"

import multer from "multer";
import {Request, Response} from "express";
import {AppService} from "./service";

const storage = multer.diskStorage({
    destination: 'haha/',
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        // Get the file extension
        const ext = file.originalname.split('.').pop();
        const filename = `${timestamp}.${ext}`;
        cb(null, filename);
    }
});



@Controller('app')
export class AppController {

    constructor(readonly appService: AppService) {}

    hello() {
        this.appService.getData()
    }

    @Get("kdata")
    getData(req: Request, res: Response){
        res.send("Hello World")
        this.hello()
    }

    @Upload('/ipfs', { storage: storage, })
    uploadFile(req: Request, res: Response,) {
        if (req.file) {
            res.send('File uploaded successfully!');
        } else {
            res.status(400).send('No files were uploaded.');
        }
    }
}
