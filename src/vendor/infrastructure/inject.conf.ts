import {KoaServer} from "./server";
import {APIService} from "../adapter/presenter/service";
import {Container} from "inversify"
import {Types} from "../utilities/TYPES";
import {BaseProvider} from "../entity/bases/provider";
import {Provider} from "../entity/bases/model";
import {bind as routerBind} from "./service"
const container = new Container();

container.bind<Provider<APIService>>(Types.Entity.RouteProvider).toConstantValue(new BaseProvider<APIService>(container));

// adaptersTranscoder
routerBind(container);
container.bind<KoaServer>(Types.Common.Server).toConstantValue(new KoaServer(container.get<Provider<APIService>>(Types.Entity.RouteProvider)));


export default container;
