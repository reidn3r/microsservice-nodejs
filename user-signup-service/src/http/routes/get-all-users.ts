import { FastifyInstance } from "fastify";
import { UserRepository } from "../../repository/UserRepository";

export async function GetAllUsers(app: FastifyInstance){
    app.get('/user/all', async(request, reply) => {
        const userRepository = new UserRepository();
        try{
            const data = await userRepository.findAllUsers();
            return reply.status(200).send({ data });
        }
        catch(err){
            throw new Error("Falha ao buscar usuarios");
        }
    })
}