import { RabbitMQServer } from "../src/amqp/message-server";

export const amqp = new RabbitMQServer("amqp://admin:admin@localhost:5672");