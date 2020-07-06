import path from "path";
import fs from "fs";
import toml from "toml";

export class DatabaseConfigurationError extends Error{}

export interface DatabaseConfig {
    type : string
    host : string
    port : number
    username : string
    password : string
    database : string
    entities: string[]
    subscribers: string[]
    migrations: string[]
    ssl: boolean,
    cli: {
        entitiesDir: string
        migrationsDir: string
        subscribersDir: string
    }
    extra: {
        ssl : {
            rejectUnauthorized:boolean
        }
    }
}

const isDatabaseConfig = (data : any) : data is DatabaseConfig => {

    return true;
}

export const load = () : DatabaseConfig => {

    let databaseConfigFilePath =
        process.env.DATABASE_CONFIG_PATH ||
        path.join(
            (process.env.CONTEXT_ROOT || path.join(__dirname, "../../../")),
            "../config","db.toml"
        );
    const dbURI = process.env.DATABASE_URI;
    const regex = /(.+):\/\/(.+):(.+)@(.+?):([1-9]+)(?=\/)(.+)/
    const parsed = regex.exec(dbURI || "")
    const databaseConfigString = fs.readFileSync(databaseConfigFilePath).toString()
    const dbConfig = toml.parse(databaseConfigString);
    if(isDatabaseConfig(dbConfig)) {
        dbConfig.entities = dbConfig.entities.map(
            (e:string) => {return path.join(process.env.CONTEXT_ROOT || "", e)}
        )
        console.log(dbConfig.entities);
        dbConfig.migrations = dbConfig.migrations.map(
            (e:string) => {return path.join(process.env.CONTEXT_ROOT || "", e)}
        )
        dbConfig.subscribers = dbConfig.subscribers.map(
            (e:string) => {return path.join(process.env.CONTEXT_ROOT || "", e)}
        )
        dbConfig.cli.entitiesDir = path.join(process.env.CONTEXT_ROOT || "", dbConfig.cli.entitiesDir)
        dbConfig.cli.migrationsDir = path.join(process.env.CONTEXT_ROOT || "", dbConfig.cli.migrationsDir)
        dbConfig.cli.subscribersDir = path.join(process.env.CONTEXT_ROOT || "", dbConfig.cli.subscribersDir)

        if(!parsed)     return dbConfig
        dbConfig.type = parsed[1] || dbConfig.type
        dbConfig.username = parsed[2] || dbConfig.username
        dbConfig.password = parsed[3] || dbConfig.password
        dbConfig.host = parsed[4] || dbConfig.host
        dbConfig.port = parseInt(parsed[5]) || dbConfig.port
        dbConfig.database = parsed[6] || dbConfig.database
    }
    return dbConfig
}