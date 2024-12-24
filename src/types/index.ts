
export type Provider<T = any> = any;
export type Constructor<T = any> = new (...args: any[]) => T;

export interface ModuleMetadata {
    controller: Provider,
    providers?: Array<Provider>
}

export interface InjectableOptions {

}

export interface ForwardReference<T = any> {
    forwardRef: T;
}

export interface InjectRouter{
    rootPath?:string
    debug?:boolean
    nodes: Array<Provider>
}
