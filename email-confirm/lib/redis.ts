import { createClient } from 'redis';

export const redis = createClient()
    .on('error', (err) => { console.log(err)} )
    .on('connect', (msg) => console.log("Redis Connected."));