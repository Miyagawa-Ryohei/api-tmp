import {APIService} from "./service";
import {Context} from "koa";
import {addGet} from "../../infrastructure/server";

export class HealthCheckService extends APIService{

    constructor(path : string) {
        super(path)
    }

    regist(){
        addGet(this.path,this.get.bind(this));
    }

    async get(context : Context){
        context.status = 200;
        context.message = "OK";
        return
    }
}

export const Service = HealthCheckService
