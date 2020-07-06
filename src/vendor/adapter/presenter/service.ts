import * as ServerConfigLoader from "../../infrastructure/config/server";
import {Context} from "koa";

export abstract class APIService {
    protected config : ServerConfigLoader.ServerConfig
    constructor(protected path : string){
        this.config = ServerConfigLoader.load();
    }

    abstract regist(): void;

    get(context : Context) : Promise<void> {
        throw new Error("Not implemented yet")
    }
    put(...arg : any) : Promise<void> {
        throw new Error("Not implemented yet")
    }
    delete(...arg : any) : Promise<void> {
        throw new Error("Not implemented yet")
    }
    post(...arg : any) : Promise<void> {
        throw new Error("Not implemented yet")
    }
}