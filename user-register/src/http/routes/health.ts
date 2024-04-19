import { FastifyInstance } from "fastify";

export async function Health(app:FastifyInstance){
    app.get('/', (request, reply) => {
        return reply.status(200).send({ message: "ok" });
    })
}