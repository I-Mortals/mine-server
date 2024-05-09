import {Constructor, ForwardReference, InjectableOptions, InjectRouter, ModuleMetadata, Provider} from "src/types";
import "reflect-metadata";
import multer, { Multer } from 'multer'

export const Service_Metadata = "Service"
export const Controller_Metadata = "Controller"
export const Modules_Metadata = "Modules"
export const Method_Metadata = "Method"
export const Path_Metadata = "Path"
export const Upload_Metadata = "Upload"
export const Router_Metadata = "Router"

export const Methods = {
    Get: "GET",
    Post: "POST",
    Upload: "POST",
    Delete: "DELETE",
    Put:"Put"
}

const MappingMethod = (method: string) => (path: string): MethodDecorator => {
    return (target, key: string, desc: PropertyDescriptor) => {
        Reflect.defineMetadata(Method_Metadata, method, target,key);
        Reflect.defineMetadata(Path_Metadata, path, target,key);
    }
}
export function Upload(path: string,multerOptions:multer.Options): MethodDecorator {
    return (target, key: string, desc: PropertyDescriptor) => {
        Reflect.defineMetadata(Method_Metadata, Methods.Upload, target,key);
        Reflect.defineMetadata(Path_Metadata, path, target,key);
        Reflect.defineMetadata(Upload_Metadata, multerOptions, target,key);
    }
}


export const Get = MappingMethod(Methods.Get)
export const Post = MappingMethod(Methods.Post)
export const Delete = MappingMethod(Methods.Delete)
export const Put = MappingMethod(Methods.Put)


export function Body(): MethodDecorator {
    return (target, key: string, desc: PropertyDescriptor) => {

    }
}

export function Modules(metadata: ModuleMetadata): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(
            Modules_Metadata,
            metadata,
            target,
        )
    }
}

export function Controller(prefix: string): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(
            Controller_Metadata,
            prefix,
            target
        )
    }
}

export function Injectable(options?: InjectableOptions): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(
            Controller_Metadata,
            options,
            target,
        )
    }
};

export const forwardRef = (fn:Provider):ForwardReference<Provider>=> ({
    forwardRef: fn,
});

export function RouterModules(options: InjectRouter): ClassDecorator {
    return function (target) {
        Reflect.defineMetadata(
            Router_Metadata,
            options,
            target
        )
    }
}