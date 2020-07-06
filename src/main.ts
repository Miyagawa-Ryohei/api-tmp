import "reflect-metadata"
import container from "./vendor/infrastructure/inject.conf";
import {Types} from "./vendor/utilities/TYPES";
import {KoaServer} from "./vendor/infrastructure/server";
const server = container.get<KoaServer>(Types.Common.Server);

const init = () : void => {
    server.setup();
};

const run = async () : Promise<void> => {
    return server.start()
};

export const main = async () => {
    try {
        await init();
        await run();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

main();

