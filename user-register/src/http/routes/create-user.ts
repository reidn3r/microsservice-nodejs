import { prisma } from "../../../lib/prisma";
import { UrlComposeUtil } from '../../../utils/url-util';
import { hash, genSaltSync } from "bcrypt";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createUserAdapter } from '../../adapter/create-user-adapter';
import { amqp } from '../../../lib/rabbitmq';

export async function CreateUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .post('/user/new', createUserAdapter ,async(request, reply) => {
        const { name, email, password } = request.body;
        const hash_pw = await hash(password, genSaltSync(10)); 
        const link = new UrlComposeUtil();

        try{
            const foundUser = await prisma.user.findUnique({ where:{ email:email } });
            if(foundUser) throw new Error("User already registered");

            const [user, [id, urlParam]] = await Promise.all([
                prisma.user.create({
                    data:{
                        name:name, 
                        email:email,
                        password:hash_pw
                    }
                }),
                link.createUrlParam(email)
            ]);

            const message = { email, id, urlParam };
            // await amqp.publish("user::queue", JSON.stringify(message));
            await amqp.publishInExchange("amq.direct", "user:route", JSON.stringify(message));
            
            return reply.status(201).send({ email, name })
        }
        catch(err){
            throw new Error("Erro ao criar usuário");
        }
    })
}