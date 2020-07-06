import {APIService} from "../service";
import {Context, Next} from "koa";
import {addGet} from "../../../infrastructure/server";
import {updateToken, isValidToken} from "../../../usecase/authorization";

export class TokenService extends APIService{


    constructor(path : string) {
        super(path)
    }

    regist(){
        addGet(this.path,this.get.bind(this));
    }

    async get(context : Context, next : Next){
        try {
            const token = context.request.get("Authorization-Token")
            const newToken = updateToken(token);
            context.response.body = {token : newToken};
        } catch(e) {
            console.log(e)
            context.status = 500;
            context.response.body = {error : e.message}
        }
        return
    }

    async check(context : Context, next : Next){
        try {
            if(!context.path.startsWith("/api") && context.path === "/api/login"){
                await next();
                return;
            }
            const token = context.request.get("Authorization-Token")
            if(await isValidToken(token)){
                await next();
                return;
            } else {
                context.throw(400,"not authorization")
            }
        } catch (e) {
            console.log(e)
            context.throw(400,e.message)
        }
    }

}

export const Service = TokenService
