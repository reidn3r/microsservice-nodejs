import { redis } from "../lib/redis";
import { v4 as uuidv4 } from 'uuid';

export class UrlComposeUtil {

    public async createUrlParam(email:string):Promise<string[]>{
        const link:string = uuidv4().replaceAll("-", "");
        const id:string = `email::${email}`;
        
        await Promise.all([
            redis.set(id, link, {
                EX: 60, //TTL: 60s
            }),
            redis.rPush("set::ids", id)
        ]);
        
        return [id, link];
    }
} 