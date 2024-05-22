import dotenv from 'dotenv';
import { redis } from '../../lib/redis';
import { amqp } from '../../lib/rabbitmq';
import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { CreateUser } from './routes/create-user';
import { Health } from './routes/health';
import { GetAllUsers } from './routes/get-all-users';

//dotenv
dotenv.config();

//fastify config
const app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//routes
app.register(CreateUser);
app.register(Health);
app.register(GetAllUsers);


const PORT:number = Number(process.env.PORT) || 8080;
app.listen({ port: PORT }, async(err) => {
    try{
        await amqp.start();
        await redis.connect();
        console.log(`user-service: http://localhost:${PORT}`);
    }
    catch(err){
        console.log(err);
    }
})