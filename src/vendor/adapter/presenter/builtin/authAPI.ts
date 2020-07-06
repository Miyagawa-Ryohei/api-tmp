import {APIService} from "../service";
import {Context, Next} from "koa";
import {addPost} from "../../../infrastructure/server";
import {authorization, editAccount, signUp} from "../../../usecase/authorization";

export class AuthService extends APIService{


    constructor(path : string) {
        super(path)
    }

    regist(){
        addPost(this.path,this.post.bind(this));
        addPost(`${this.path}/new`,this.create.bind(this));
    }

    async edit(context : Context, next : Next){
        const pass = context.request.body.pass
        const token = context.request.get("Authorization-Token")
        try {
            editAccount(pass, token);
        } catch(err) {
            context.status = 500;
            context.body = {message : err.message}
        }
    }

    async create(context : Context, next : Next){
        const user = context.request.body.user
        const pass = context.request.body.pass
        const type = context.request.body.type
        try {
            signUp(user, pass, type);
        } catch(err) {
            context.status = 500;
            context.body = {message : err.message}
        }
    }

    async post(context : Context, next : Next){
        const user = context.request.body.user
        const pass = context.request.body.pass
        try {
            if(!context.session) return context.throw({
                status : 500,
                message : "Session Error"
            })
            const token = await authorization(user,pass)
            if(token){
                context.response.body = {
                    token : token,
                }
                context.message = "OK"
            } else {
                context.response.status = 403;
                context.response.body = 'Not Authorization';
            }
            await next()
            return
        } catch(e) {
            console.log(e)
            return context.throw(403, e.message);
        }
    }
}

export const Service = AuthService
