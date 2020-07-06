import {DatabaseConfig} from "./config/db";
import User from "../entity/builtin/Account";
import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {SqliteConnectionOptions} from "typeorm/driver/sqlite/SqliteConnectionOptions";
import * as DBConfig from "./config/db";
import config from "config"
import path from "path";

const conf = JSON.parse(JSON.stringify(config.get("sqlite")))

const SQLITE_CONNECTION_CONFIG : SqliteConnectionOptions= {
    name:"builtin",
    type:"sqlite",
    database: `${conf.data_directory || process.env.CONTEXT_ROOT || process.cwd()}/data/builtin.sqlite`,
    entities: [ User ],
    logging: true
}


export class DBManagerFactory {

    private manager : DBUtil;

    constructor() {
        this.manager = DBUtil.getDBManager()
    }

    setConfig(){
        this.manager.setConfig(DBConfig.load())
    }

    getDBManager () : DBUtil{
        if(!this.manager){
            this.manager = DBUtil.getDBManager()
        }
        return this.manager;
    }
}

class DBUtil {

    private connections : {[key : string] : Connection}
    static util : DBUtil | null = null
    private dbConfig : DatabaseConfig | null

    constructor() {
        this.connections = {}
        this.dbConfig = null
    }

    setConfig(user_config : DatabaseConfig){
        this.dbConfig = JSON.parse(JSON.stringify(user_config))
    }
    static getDBManager () : DBUtil{
        if(!this.util){
            this.util = new DBUtil()
        }
        return this.util;
    }

    getConnection() : Connection{
        if(!("user_definition" in this.connections)) {
            return this.connections["builtin"]
        } else {
            return this.connections.user_definition
        }
    }

    async createConnections(use_sqlite? : boolean, use_orm? : boolean) {
        if(this.dbConfig && use_orm){
            this.dbConfig["name"]="user_definition"
            this.dbConfig.entities.push(path.join(process.env.CONTEXT_ROOT||"","./vendor/entity/builtin/*.ts"));
            this.dbConfig.entities.push(path.join(process.env.CONTEXT_ROOT||"","./vendor/entity/builtin/*.js"));
            if(!this.connections["user_definition"]) {
                this.connections["user_definition"] = await createConnection(this.dbConfig as ConnectionOptions)
            }
        } else {
            if(!this.connections.builtin){
                this.connections.builtin = await createConnection(SQLITE_CONNECTION_CONFIG)
            }
        }
    }
}