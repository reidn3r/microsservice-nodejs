import { FastifyInstance } from "fastify";
import { prisma } from "../../../lib/prisma";

export async function GetAllUsers(app: FastifyInstance){
    app.get('/user/all', async(request, reply) => {
        try{
            const data = await prisma.user.findMany({
                select:{
                    id: true,
                    email:true,
                    name:true,
                    createdAt: true
                }
            })
            return reply.status(200).send({ data });
        }
        catch(err){
            throw new Error("Falha ao buscar usuarios");
        }
    })
}