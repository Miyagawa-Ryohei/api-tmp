import * as path from "path";
import * as rs from "readline-sync"
import * as fs from "fs-extra";
const man = `
New Clone Template 
        Authorized r_miyagawa.
`


const main = () => {
    console.log(man)
    let nameIndex = process.argv.findIndex((a)=> a==="-p")
    let projectName = "";
    if (nameIndex !== -1 ){
        projectName = process.argv[nameIndex + 1 ];
    }
    let outIndex = process.argv.findIndex((a)=> a==="-o")
    let projectDirectory = "";
    if (outIndex !== -1 ) {
        projectDirectory = process.argv[outIndex + 1];
    }
    while (!projectName) {
        projectName = rs.question("project name? -> ");
    }
    while (!projectDirectory) {
        projectDirectory = rs.question("output directory")
    }
    const output = path.join(projectDirectory,projectName,"/");
    fs.mkdirSync(output,{recursive : true});
    const origin = path.join(__dirname,"..");
    console.log("clone config ...")
    fs.copySync(path.join(origin,"config"),path.join(output,"config"));
    console.log("clone src ...")
    fs.copySync(path.join(origin,"src"),path.join(output,"src"));
    console.log("clone tools ...")
    fs.copySync(path.join(origin,"tools"),path.join(output,"tools"));
    console.log("clone .gitignore ...")
    fs.copyFileSync(path.join(origin,".gitignore"),path.join(output,".gitignore"));
    console.log("clone Dockerfile ...")
    fs.copyFileSync(path.join(origin,"Dockerfile"),path.join(output,"Dockerfile"));
    console.log("clone package.json ...")
    fs.copyFileSync(path.join(origin,"package.json"),path.join(output,"package.json"));
    console.log("clone yarn.lock ...")
    fs.copyFileSync(path.join(origin,"yarn.lock"),path.join(output,"yarn.lock"));
    console.log("clone README.md ...")
    fs.copyFileSync(path.join(origin,"README.md"),path.join(output,"README.md"));
    console.log("clone tsconfig.json ...")
    fs.copyFileSync(path.join(origin,"tsconfig.json"),path.join(output,"tsconfig.json"));
    console.log("done!")
}

main();