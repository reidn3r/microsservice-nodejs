import { Channel, Connection, ConsumeMessage, Message, connect } from "amqplib";

export class RabbitMQServer {

    private conn:Connection;
    private channel:Channel;
    private uri:string;
    
    constructor(uri: string){
        this.uri = uri;
    }

    async start(): Promise<void>{
        this.conn = await connect(this.uri);
        this.channel = await this.conn.createChannel();
        console.log("RabbitMQ Connected.");
    }

    async publish(queue:string, message:string): Promise<void>{
        this.channel.sendToQueue(queue, Buffer.from(message));
    }

    async publishInExchange(exchange: string, routingKey:string, message:string):Promise<boolean>{
        return this.channel.publish(exchange, routingKey, Buffer.from(message));
    }

    async consume(queue: string, callback:(message:Message) => void){
        return this.channel.consume(queue, (message: ConsumeMessage | null) => {
            if(message){
                callback(message);
                this.channel.ack(message);    
            }
        })
    }
}