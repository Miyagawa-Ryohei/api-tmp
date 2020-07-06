import * as path from "path";
import * as uuid from "uuid"
import * as rs from "readline-sync"
import * as fs from "fs";
const man = `
New API Service Stub Generator
        Authorized r_miyagawa.
`

const apiPath = path.join(__dirname, "../src/adapter/presenter/")

const main = () => {
    console.log(man)
    const serviceName = rs.question("service class name? -> ");
    const route = rs.question("which is route? -> ")
    let output = rs.question(`which is output?(default : ${apiPath}) -> `)
    output = output || apiPath;
    fs.mkdirSync(output,{recursive:true})
    const outputPath = path.join(output, serviceName+".ts");
    const genCode = generateServiceCode(serviceName);
    const class_path = path.relative(path.join(process.cwd(),"/src"),path.join(output, serviceName));
    const service_id = uuid.v4();
    const configString = addConfig({route,class : class_path, service_id})
    console.log(outputPath)
    console.log(genCode)
    fs.writeFileSync(outputPath,genCode)
    console.log(configString)
    fs.writeFileSync(path.join(__dirname,"../config/server.toml"),configString)

}

const addConfig = (arg : any) => {
    const serverConfigFilePath = process.env.SERVER_CONFIG_PATH || path.join(__dirname,"../config","server.toml");
    const serverConfigString = fs.readFileSync(serverConfigFilePath).toString()
    const configString = []
    configString.push(`    [[services.service]]`)
    configString.push(`        type="${arg["type"] || "http"}"`)
    configString.push(`        route="${arg.route}"`)
    configString.push(`        class="${arg.class}"`)
    configString.push(`        service_id="${arg.service_id}"`)
    configString.push(``)
    return [serverConfigString,configString.join("\n")].join("\n");
}

const generateServiceCode = (serviceName : string) => {
    return  `
import {APIService} from "../../vendor/adapter/presenter/service";
import {Context} from "koa";
import {addGet} from "../../vendor/infrastructure/server";

export class ${serviceName} extends APIService{

    constructor(path : string) {
        super(path)
    }

    regist(){
        addGet(this.path,this.get.bind(this));
    }

    async get(context : Context){
        context.status = 200;
        context.message = "not implemented yet. ${serviceName} stub code return response";
        return
    }

}

export const Service = ${serviceName};
`

}

main();