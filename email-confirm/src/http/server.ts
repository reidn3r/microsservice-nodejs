import fastify from "fastify";
import { redis } from "../../lib/redis";
import { amqp } from "../../lib/rabbitmq";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { Health } from "./routes/health";
import { ConfirmUser } from "./routes/confirm-user";
import { Email } from "../utils/email-util";
import { GenNewURL } from "./routes/generate-new-url";

//fastify config
const app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//routes
app.register(Health);
app.register(ConfirmUser);
app.register(GenNewURL);

const PORT:number = Number(process.env.PORT) || 5050;
app.listen({ port: PORT }, async(err) => {
    await Promise.all([redis.connect(), amqp.start()]);
    await amqp.consume("user::queue", async(message) => {
        const email = new Email(message);
        await email.createEmailToConfirmRegister();
        await email.execute();
    });
    console.log(`email-service: http://localhost:${PORT}`);
})