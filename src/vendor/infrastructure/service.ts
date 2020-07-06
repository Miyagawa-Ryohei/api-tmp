import path from "path";
import {Container} from "inversify"
import {APIService} from "../adapter/presenter/service";
import * as ServerConfig from "./config/server"
export const bind = (container : Container) => {
    const serverConfig = ServerConfig.load()
    serverConfig.services.service.map(s => {
        let class_path = "";
        if(!(s.class.startsWith("/"))) class_path = path.join(serverConfig.services.context_root,s.class)
        else class_path = s.class
        if(!class_path.length) return
        const router = require(class_path);
        console.log(`load module 【${s.class}】`)
        container.bind<APIService>(Symbol.for(s.service_id)).toConstantValue(new router.Service(s.route));
    })
}


