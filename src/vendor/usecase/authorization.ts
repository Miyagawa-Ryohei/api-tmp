import Account from "../entity/builtin/Account";
import {DBManagerFactory} from "../infrastructure/DB";

const pepper = "4bc6bfa2166d40878740414cbb0b66dc"

const serverKey = Buffer.from("3912bed9ac2045a2a0fb4d10c2aad892").toString('hex').slice(0, 16);

class AuthError extends Error {}

export const updateToken = async (token : string) : Promise<string> => {

    const factory = new DBManagerFactory();
    const dbmanager = factory.getDBManager()
    const connection = dbmanager.getConnection()
    const entityManager = connection.createEntityManager()

    const account = await entityManager.findOne(Account,{token : token});
    if(!account) throw new AuthError("invalid token");

    const newToken = account.createToken(serverKey);

    account.setToken(newToken)
    await entityManager.save([account]);
    return newToken;
}

export const isValidToken = async (token: string) => {
    const factory = new DBManagerFactory();
    const dbmanager = factory.getDBManager()
    const connection = dbmanager.getConnection()
    const entityManager = connection.createEntityManager()
    const account = await entityManager.findOne(Account,{token : token});

    if(!account) throw new AuthError("invalid token");
    const now = new Date();
    const token_contents = account.decodeToken(serverKey);
    const expected = token_contents.split(":")[0];

    if(expected !== account.accessKey) throw new AuthError("not authorization");
    if(!account.token_expired_at) return true;

    if(now < account.token_expired_at) {
        return true;
    }else {
        throw new AuthError("token is expired");
    }
}

export const authorization = async (name:string, pass:string) : Promise<string> => {

    const factory = new DBManagerFactory();
    const dbmanager = factory.getDBManager()
    const connection = dbmanager.getConnection()
    const entityManager = connection.createEntityManager()

    const account = await entityManager.findOne(Account,{name : name});
    if(!account) throw new AuthError("user is not found");

    const expected = account.createAccessKey(pepper,pass);
    const token = account.createToken(serverKey)

    if(expected === account.accessKey) {
        account.setToken(token)
        await entityManager.save([account]);
        return token
    }else {
        throw new AuthError("password is incorrect");
    }

}

export const signUp = async (name:string, pass:string, type:string) => {
    console.log(name)
    const account = Account.buildNew(name,pass,type,pepper)
    const factory = new DBManagerFactory();
    const dbmanager = factory.getDBManager()
    const connection = dbmanager.getConnection()
    const repository = connection.getRepository(Account);
    await repository.save([account]);
    return true
}

export const editAccount = async (token:string, pass:string) => {
    console.log(name)
    const factory = new DBManagerFactory();
    const dbmanager = factory.getDBManager();
    const connection = dbmanager.getConnection();
    const repository = connection.getRepository(Account);
    const account = await repository.findOne({token:token})
    if(!account) throw new AuthError("user is not found");
    account.setAccessKey(account.createAccessKey(serverKey,pass));

    await repository.save([account]);
    return true
}
