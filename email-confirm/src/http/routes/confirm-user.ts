import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { confirmUserAdapter } from "../../adapter/confirm-user-adapter";
import { prisma } from '../../../lib/prisma';
import { redis } from "../../../lib/redis";

export async function ConfirmUser(app:FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .get('/confirm/:url/:email', confirmUserAdapter ,async(request, reply) => {
        const { url, email } = request.params;

        try{
            const foundConfirmed = await prisma.email.findMany({
                where:{
                    email:email,
                    confirmed: {
                        equals: true
                    }
                }
            });
            if(foundConfirmed.length > 0) throw new Error("User already confirmed");
            
            /* 
                - Verifica se o link é válido
                - Encontra pelo email e link e marca como confirmado
            */
        
            const [foundUrl, foundEmail] = await Promise.all([
                redis.GET(`email::${email}`),
                prisma.email.findMany({
                    where:{
                        email
                    }
                })
            ]);

            if(foundEmail.length == 0) return reply.status(404).send({ message: "emaill nao encontrado" });
            if(!foundUrl) return reply.status(404).send({ 
                message: "url expirado", 
                retry:`http://localhost:${process.env.PORT}/confirm/new/${email}`
            });

            await prisma.email.update({
                data:{
                    confirmed: true
                },
                where:{
                    link_email: {
                        email:email,
                        link:url
                    }
                }
            });

            return reply.status(200).send({ message: `${email} confirmed` });
        }
        catch(err){
            console.log(err);
            throw new Error("Erro ao validar usuario");
        }
    })
}