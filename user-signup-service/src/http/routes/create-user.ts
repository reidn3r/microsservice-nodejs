import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { amqp } from '../../../lib/rabbitmq';
import { hash, genSaltSync } from "bcrypt";
import { UserRepository } from "../../repository/UserRepository";
import { createUserAdapter } from '../../adapter/create-user-adapter';
import { UrlComposeUtil } from '../../../utils/url-util';

export async function CreateUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .post('/user/new', createUserAdapter ,async(request, reply) => {
        const { name, email, password } = request.body;
        const link = new UrlComposeUtil();
        const userRepository = new UserRepository();
        const hash_pw = await hash(password, genSaltSync(10)); 

        try{
            const foundUser = await userRepository.findUserByEmail(email);
            if(foundUser) throw new Error("User already registered");

            const [user, [id, urlParam]] = await Promise.all([
                userRepository.createNewUser(name, email, hash_pw),
                link.createUrlParam(email)
            ]);

            const message = { email, id, urlParam };
            await amqp.publish("user::queue", JSON.stringify(message));
            // await amqp.publishInExchange("amq.direct", "user:route", JSON.stringify(message));
            
            return reply.status(201).send({ email, name })
        }
        catch(err:any){
            console.log(err);
            throw new Error(err.message);
        }
    })
}