import { FastifyInstance } from "fastify";
import { UrlComposeUtil } from "../../utils/url-util";
import { redis } from "../../../lib/redis";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { GenNewURLAdapter } from "../../adapter/gen-new-url-adapter";
import { EmailRepository } from "../../repository/email-repository";

export async function GenNewURL(app: FastifyInstance){
    const url = new UrlComposeUtil();
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/confirm/new/:email", GenNewURLAdapter ,async(request, reply) => {
        try{
            const { email } = request.params;
            const emailRepository = new EmailRepository();

            const [foundUrl, foundConfirmed] = await Promise.all([
                redis.GET(`email::${email}`),
                emailRepository.findConfirmedEmail(email),
            ]);

            if(foundConfirmed) return reply.status(400).send({ message: "User already confirmed" });
            
            if(foundUrl) return reply.status(401).send({ 
                // message: `http://localhost:${process.env.PORT}/confirm/{param}/${email}`
                message: `http://localhost:${process.env.PORT}/confirm/${foundUrl}/${email}`
            })
            
            const [id, param] = await url.createUrlParam(email);
            await emailRepository.saveEmailUrlAssociation(email, param);

            return reply.status(201).send({
                message: `http://localhost:${process.env.PORT}/confirm/${param}/${email}`
            })
        }
        catch(err:any){
            throw new Error(err.message)
        }
    })
}