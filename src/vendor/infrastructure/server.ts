import cors from "@koa/cors"
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import {inject, injectable} from "inversify";
import {Server} from "http";
import {Types} from "../utilities/TYPES";
import {Provider} from "../entity/bases/model";
import {APIService} from "../adapter/presenter/service";
import * as ServerConfig from "./config/server";
import {Connection} from "typeorm/connection/Connection";
import auth from "koa-basic-auth";
import session from "koa-session";
import Koa,{Context} from 'koa';
import serve from 'koa-static';
import {AuthService} from "../adapter/presenter/builtin/authAPI";
import {TokenService} from "../adapter/presenter/builtin/tokenAPI";
import {DBManagerFactory} from "./DB";
import path from "path";

export const app = new Koa();
const router = new Router();
const credential = {name : "admin", pass : "admin"}

app.use(bodyParser({jsonLimit : "300mb"}));
app.keys = ["miyagawa-ryohei"]
export type RestHandler = (...arg : any[]) => Promise<void>;
export type BasicAuthCreds = {name : string, pass : string};
export const addPost = (path : string, callBack : RestHandler) => {
    addRoute(path, "post",callBack);
};

export const addGet = (path : string, callBack : RestHandler) => {
    addRoute(path, "get",callBack);
};

export const addPut = (path : string, callBack : RestHandler) => {
    addRoute(path, "put",callBack);
};

export const addDelete = (path : string, callBack : RestHandler) => {
    addRoute(path, "delete",callBack);
};

export const addRoute = (path : string, method : string, callBack : RestHandler) => {
    const httpMethod = method.toLowerCase();
    router[httpMethod](path,callBack);
};

export const assign = () => {
    app.use(router.routes()).use(router.allowedMethods());
};

app.use(session(app))

@injectable()
export class KoaServer {
    readonly port : string;
    readonly app : Koa;
    private dbConnection : Connection | null;
    private server : Server | null;

    constructor(
        @inject(Types.Entity.RouteProvider) private provider : Provider<APIService>
    ){
        this.port = process.env.PORT || "8080";
        this.app = app;
        this.server = null;
        this.dbConnection = null;
    }

    addBasicAuth() {
        this.app.use(async (context : Context, next) => {
            try {
                await next();
            } catch (err) {
                if (401 == err.status) {
                    context.response.status = 401;
                    context.response.set('WWW-Authenticate', 'Basic');
                    context.response.body = 'You have no access here';
                } else {
                    throw err;
                }
            }
        });
        this.app.use(auth(credential));
    }

    addLoginAuth() {
        const tokenService = new TokenService("/api/token");
        this.app.use(tokenService.check)
        const authService = new AuthService("/api/login");
        tokenService.regist();
        authService.regist();
    }

    addStaticRouting(contextRoot : string) {
        this.app.use(serve(path.join(process.cwd(),"public")))
    }

    async setup() {
        const serverConfig = ServerConfig.load();
        if(serverConfig.services.allow_cors) this.app.use(cors());

        if(serverConfig.services.use_basic_auth){
            this.addBasicAuth();
        }

        if(serverConfig.services.use_login){
            this.addLoginAuth();
        }

        const factory = new DBManagerFactory()
        if(serverConfig.services.use_orm){
            factory.setConfig();
        }
        await factory.getDBManager().createConnections(serverConfig.services.use_login, serverConfig.services.use_orm);

        if(serverConfig.services.use_static){
            this.addStaticRouting(serverConfig.services.context_root);
        }

        for(let service of serverConfig.services.service){
            const rest = this.provider.get(Symbol.for(service.service_id));
            rest.regist();
        }

        assign();
    }

    start() {
        if(!this.server){
            this.server = this.app.listen(parseInt(this.port));
        }
    }

    async kill() : Promise<Server> {
        return await new Promise<Server>(((resolve, reject) => {
            if(this.server){
                this.server.close((e) => e ? reject(e) : resolve(this.server!));
                if(this.dbConnection){
                    this.dbConnection.close();
                }
            }
        }))
    }
}
