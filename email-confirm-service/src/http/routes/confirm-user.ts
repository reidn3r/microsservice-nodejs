import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { confirmUserAdapter } from "../../adapter/confirm-user-adapter";
import { redis } from "../../../lib/redis";
import { EmailRepository } from "../../repository/email-repository";

export async function ConfirmUser(app:FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>()
    .get('/confirm/:url/:email', confirmUserAdapter ,async(request, reply) => {
        const { url, email } = request.params;
        const emailRepository = new EmailRepository();

        try{
            const foundConfirmed = await emailRepository.findConfirmedEmail(email);
            if(foundConfirmed) throw new Error("User already confirmed");
            
            /* 
                - Verifica se o link é válido
                - Encontra pelo email e link e marca como confirmado
            */
        
            const [foundUrl, foundEmail] = await Promise.all([
                redis.GET(`email::${email}`),
                emailRepository.findAllByEmail(email)
            ]);

            if(foundEmail.length == 0) return reply.status(404).send({ message: "email nao encontrado" });
            if(!foundUrl) return reply.status(404).send({ 
                message: "url expirado", 
                retry:`http://localhost:${process.env.PORT}/confirm/new/${email}`
            });

            await emailRepository.confirmEmail(email, url);
            return reply.status(200).send({ message: `${email} confirmed` });
        }
        catch(err){
            console.log(err);
            throw new Error("Erro ao validar usuario");
        }
    })
}