import * as url from "node:url";
import * as http from "node:http"
import "reflect-metadata";
import {Constructor, InjectRouter, ModuleMetadata, } from "src/types";
import {
    Controller_Metadata,
    Method_Metadata,
    Methods,
    Modules_Metadata,
    Path_Metadata,
    Router_Metadata,
    Service_Metadata,
    Upload_Metadata
} from "./decorator";
import {Config} from "./config"
import {isConstructor, isFunction} from "./utlis"
import express, { RequestHandler } from "express"
import {Express} from "express"
import multer, {Multer} from 'multer'
import {Path} from "./tools";

export class Factory {

    private modules =  []
    private modulesCls =  new Map()
    private controllerCls = new Map() // Controller Class
    private controllerInstance = new Map() // Controller Instance
    private serviceCls = new Map() // Service Class
    private serviceInstance = new Map() // Service Instance
    server: Express;

    private rootPath: string = "/api"

    constructor() {
        this.server = express()
    }

    // initialize
    private async initialize(modulesCls) {

        const appModules: ModuleMetadata = Reflect.getMetadata(Modules_Metadata, modulesCls)
        console.log("Module",appModules);

        this.modules.push(appModules)

        /*controller*/

        // get routeName
        const routeName: string = Reflect.getMetadata(Controller_Metadata, appModules.controller)
        this.controllerCls.set(routeName, appModules.controller)

        const paramtypes = Reflect.getMetadata('design:paramtypes', appModules.controller);

        // get providers service
        const providersMap = paramtypes.map(item => {
            if (appModules.providers.length >= 1) {
                const cls_service = appModules.providers.find(cls_service => cls_service == item);
                if (cls_service) {
                    this.serviceCls.set(cls_service.name, cls_service);
                    // If it exists (in service CLS), it will be returned directly, and if it does not exist, it will be new
                    if(this.serviceInstance.has(item.name)) return this.serviceInstance.get(item.name)
                    const instance = new item()
                    this.serviceInstance.set(cls_service.name, instance)
                    return instance;
                }
            }
        });


        /* Filter out the classes http methodName , bind */

        // controller instance
        const clsInstance = new appModules.controller(...providersMap)
        const prototype = Object.getPrototypeOf(clsInstance)
        const methodsNames = Object.getOwnPropertyNames(prototype).filter(item => !isConstructor(item, prototype) && isFunction(item, prototype))

        // methodName
        const routeMap = methodsNames.map(methodName => {
            const fn = clsInstance[methodName];

            // get metadata
            const method: string = Reflect.getMetadata(Method_Metadata, clsInstance, methodName)
            const path: string = Reflect.getMetadata(Path_Metadata, clsInstance, methodName)

            if (method) {
                const apiPath = routeName.replace(/^\/\//, '/').replace(/^([^/])/, '/$1') + path.replace(/^\/\//, '/').replace(/^([^/])/, '/$1')
                const routeData = {
                    path: this.rootPath + apiPath,
                    methodName,
                    method,
                    fn
                }

                // bind Method
                if (method == Methods.Upload) {
                    const uploadOp: multer.Options = Reflect.getMetadata(Upload_Metadata, clsInstance, methodName)
                    const uploadKey = multer(uploadOp)
                    this.server.post(routeData.path, uploadKey.single("file"), (req, res) => {
                        fn(req, res, uploadKey)
                    })
                } else {
                    this.server[method.toLocaleLowerCase()](routeData.path, fn.bind(clsInstance))
                }

                return routeData
            }

        }).filter(item => item != undefined)

        this.controllerInstance.set(routeName, routeMap)

    }

    // create modules
    public async create(routerCls, middlewares: RequestHandler[] = [],callback?: (server: Express) => void) {
        console.log("The service is initial...");

        // middleware init
        middlewares.forEach(middleware => {
            this.server.use(middleware);
        });

        // callback init
        if(callback) callback(this.server)

        const rootModules: InjectRouter = Reflect.getMetadata(Router_Metadata, routerCls)
        console.log("InjectRouter:",rootModules)
        this.rootModules(rootModules)

        console.log("controllers", this.controllerInstance);
        console.log("serviceInstance", this.serviceInstance);

        return this
    }

    private setGlobalPrefix(path: string) {
        this.rootPath = Path(path)
    }

    // Initialize the route
    private rootModules(router: InjectRouter) {
        if (router.rootPath) this.setGlobalPrefix(router.rootPath)
        const initModule = router.nodes.map(async (route) => {
            if(!this.modulesCls.has(route.name)) {
                await this.initialize(route)
                this.modulesCls.set(route.name, route)
            }
        })
    }

    /**
     * Start a server that listens for connections
     * @param port
     * @param hostname
     * @param listeningListener
     */
    listen(port: number, hostname: string, listeningListener?: () => void): void
    listen(port: number, hostname: string): void
    listen(port: number, listeningListener?: () => void): void
    listen(port: number): void
    listen(listeningListener?: () => void): void
    public listen(port: number | (() => void) = Config.port, hostname: string | (() => void) = Config.hostname, listeningListener?: () => void): void {
        if (typeof port === "function") {
            listeningListener = port;
            port = Config.port
        }
        if (typeof hostname === "function") {
            listeningListener = hostname;
            hostname = Config.hostname
        }
        this.server.listen(port, hostname, listeningListener)
    }
}

export const FactoryInstance = new Factory();


