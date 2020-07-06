import config from "config"

export class ServerConfigurationError extends Error{}

export interface ServerConfig {
    services : {
        context_root : string
        version : string
        allow_cors? : boolean
        use_orm? : boolean
        use_authorization? : boolean
        use_login? : boolean
        use_basic_auth? : boolean
        use_static? : boolean
        use_session_ctr? : boolean
        service : {
            type : "http" | "ws"
            route : string
            service_id : string
            class : string
        }[]
    }
}

const isServerConfig = (data : any) : data is ServerConfig => {

    if(!("services" in data)) new ServerConfigurationError("services is not found");
    if(!("context_root" in data.services)) new ServerConfigurationError("context_root is not found");
    if(!(typeof(data.services.context_root) !== "string"))
        new ServerConfigurationError(`context_root expected Array : actual ${typeof(data.services.context_root)}`);

    if(!("service" in data.services)) new ServerConfigurationError("service is not found");
    if(!(Array.isArray(data.services.service)))
        new ServerConfigurationError(`service expected Array : actual ${typeof(data.services.service)}`);

    if(("allow_cors" in data.services)){
        if(!(typeof(data.services.allow_cors) !== "boolean"))
            new ServerConfigurationError(`allow_cors expected Array : actual ${typeof(data.services.allow_cors)}`);
    }

    if(("use_orm" in data.services)){
        if(!(typeof(data.services.use_orm) !== "boolean"))
            new ServerConfigurationError(`use_orm expected Array : actual ${typeof(data.services.use_orm)}`);
    }

    if(("use_login" in data.services)){
        if(!(typeof(data.services.use_login) !== "boolean"))
            new ServerConfigurationError(`use_login expected Array : actual ${typeof(data.services.use_login)}`);
    }

    if(("use_basic_auth" in data.services)){
        if(!(typeof(data.services.use_basic_auth) !== "boolean"))
            new ServerConfigurationError(`use_basic_auth expected Array : actual ${typeof(data.services.use_basic_auth)}`);
    }

    if(("use_session_ctr" in data.services)){
        if(!(typeof(data.services.use_session_ctr) !== "boolean"))
            new ServerConfigurationError(`use_session_ctr expected Array : actual ${typeof(data.services.use_session_ctr)}`);
    }

    data.services.service.map((s:any) => {

        if(!("type" in s)) new ServerConfigurationError("type is not found");
        if(["http","ws"].indexOf(s.type) === -1)
            new ServerConfigurationError(`type expected "http" or "ws" : actual ${typeof(s.route)}`);

        if(!("route" in s)) new ServerConfigurationError("route is not found");
        if(!(typeof(s.route) !== "string"))
            new ServerConfigurationError(`route expected string : actual ${typeof(s.route)}`);

        if(!("service_id" in s)) new ServerConfigurationError("service_id is not found");
        if(!(typeof(s.service_id) !== "string"))
            new ServerConfigurationError(`service_id expected string : actual ${typeof(s.service_id)}`);

        if(!("class" in s)) new ServerConfigurationError("class is not found");
        if(!(typeof(s.class) !== "string"))
            new ServerConfigurationError(`route expected string : actual ${typeof(s.class)}`);
    })

    return true;
}

export const load = () : ServerConfig => {
    const serverConfig = config.get("server");
    if(isServerConfig(serverConfig)) return serverConfig
    else throw(serverConfig)
}