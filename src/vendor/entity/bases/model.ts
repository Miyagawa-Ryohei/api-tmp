
export interface Provider<T> {
    get(symbol: Symbol): T;

    getAll(types: { [key: string]: Symbol }): T[];
}

