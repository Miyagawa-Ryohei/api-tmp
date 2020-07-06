import {Container, injectable} from "inversify";
import {Provider} from "./model";


@injectable()
export class BaseProvider<T> implements Provider<T> {

    constructor(private container: Container) {
    }

    get(s: symbol): T {
        return this.container.get<T>(s)
    }

    getAll(types: { [key: string]: symbol }): T[] {
        const instances: T[] = [];
        for (let k  in types) {
            instances.push(this.container.get<T>(types[k]))
        }
        return instances;
    }
}