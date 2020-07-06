
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import * as crypto from "crypto"

@Entity({name : "account"})
export default class Account {

    constructor(){
        this.name = ""
        this.type = ""
        this.accessKey = ""
        this.secretKey = ""
        this.token = ""
    }

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name:string;

    @Column()
    type:string;

    @Column({name : "access_key"})
    accessKey:string;

    @Column({name : "secret_key"})
    secretKey:string;

    @Column()
    token:string;

    @Column()
    token_expired_at? : Date

    @CreateDateColumn()
    created_at?:Date

    @UpdateDateColumn()
    updated_at?:Date

    setAccessKey(accessKey : string) {
        this.accessKey = accessKey;
    }

    createAccessKey(pepper:string, password:string){
        const seed = `${this.name}:${password}:${this.secretKey}:${pepper}`;
        return crypto.createHash('sha256').update(seed).digest('hex')
    }

    setToken(token : string, tokenExpiredMinutes : number = 30){
        const now = new Date()
        this.token = token;
        if(this.type !== "service"){
            now.setMinutes(now.getMinutes() + tokenExpiredMinutes)
        }
        this.token_expired_at = now
    }

    static buildNew(username : string, password : string, type : string, pepper : string): Account {
        const account = new Account();
        account.name = username;
        account.type = type;
        account.secretKey = crypto.randomBytes(32).toString('base64').substr(0, 32);
        account.setAccessKey(account.createAccessKey(pepper, password));
        return account;
    }

    createToken(serverKey: string){
        const seed = this.accessKey + ":" + crypto.randomBytes(16).toString('base64');
        const cipher = crypto.createCipheriv('aes-256-cbc', this.secretKey, serverKey);
        const c = cipher.update(seed, 'utf8', 'hex');
        return c+cipher.final('hex');
    }

    decodeToken(serverKey: string){
        console.log(this.secretKey);
        console.log(serverKey);
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.secretKey, serverKey);
        console.log("decipher created");
        console.log(this.token);
        const d = decipher.update(this.token, 'hex', 'utf8');
        return d + decipher.final('utf8');
    }

    toJSON() {
        return {
            id : this.id,
            name : this.name,
            accessKey : this.accessKey,
            token : this.token,
            token_expired_at : this.token_expired_at,
            create_at : this.created_at,
            updated_at : this.updated_at
        }
    }
}
