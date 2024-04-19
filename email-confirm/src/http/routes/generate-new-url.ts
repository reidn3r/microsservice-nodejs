import { FastifyInstance } from "fastify";
import { UrlComposeUtil } from "../../utils/url-util";
import { prisma } from "../../../lib/prisma";
import { redis } from "../../../lib/redis";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { GenNewURLAdapter } from "../../adapter/gen-new-url-adapter";

export async function GenNewURL(app: FastifyInstance){
    const url = new UrlComposeUtil();
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/confirm/new/:email", GenNewURLAdapter ,async(request, reply) => {
        const { email } = request.params;

        const [foundUrl, foundConfirmed] = await Promise.all([
            redis.GET(`email::${email}`),
            prisma.email.findFirst({
                where: {
                    email:email,
                    confirmed: {
                        equals: true
                    }
                }
            })
        ]);

        if(foundConfirmed) return reply.status(400).send({ message: "User already confirmed email "});
        
        if(foundUrl) return reply.status(401).send({ 
                message: `http://localhost:${process.env.PORT}/confirm/${param}/${email}`
        })
        
        const [id, param] = await url.createUrlParam(email);
        await prisma.email.create({
            data: {
                email:email,
                link:param,
            }
        })

        return reply.status(201).send({
            message: `http://localhost:${process.env.PORT}/confirm/${param}/${email}`
        })
    })
}