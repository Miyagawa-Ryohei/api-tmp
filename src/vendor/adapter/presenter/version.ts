import {APIService} from "./service";
import {Context} from "koa";
import {addPost} from "../../infrastructure/server";

export class VersionService extends APIService{
    constructor( path : string ) {
        super(path);
    }

    regist(){
        addPost(this.path,this.get.bind(this));
    }

    async post(context : Context){
        context.status = 200;
        context.message = "OK";
        const version = this.config.services.version
        context.response.body = {
            version
        };
        return
    }
}

export const Service = VersionService

