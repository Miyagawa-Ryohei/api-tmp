import * as path from "path";
import * as rs from "readline-sync"
import * as fs from "fs";
const man = `
New Entity Stub Generator
        Authorized r_miyagawa.
`

const apiPath = path.join(__dirname, "../src/entity/model/")

const main = () => {
    console.log(man)
    const className = rs.question("Entity class name? -> ");
    const tableName = rs.question("DBTableName? -> ")
    let output = rs.question(`which is output?(default : ${apiPath}) -> `)
    output = output || apiPath;
    const outputPath = path.join(output, className+".ts");
    const genCode = generateEntityCode(className,tableName);
    console.log(outputPath)
    console.log(genCode)
    fs.writeFileSync(outputPath,genCode)
}

const generateEntityCode = (className : string, tableName: string) => {
    return  `
import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name : "${tableName}"})
export default class ${className} {

    constructor(){
        this.id = 0
    }
    @PrimaryGeneratedColumn()
    id: number;

    toJSON() {
        return {
            id : this.id,
        }
    }
}
`
}

main();