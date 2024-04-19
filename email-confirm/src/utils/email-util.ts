import { prisma } from "../../lib/prisma";
import { Message } from "amqplib";

export class Email {

    private id:string;
    private link:string;
    private email:string;

    constructor(message:Message){
        const data = JSON.parse(message.content.toString());
        this.id = data.id;
        this.email = data.email;
        this.link = data.urlParam;
    }

    public async execute(){
        console.log(`confirm at:\n http://localhost:${process.env.PORT}/confirm/${this.link}/${this.email}`);
    }

    public createEmailToConfirmRegister = async() => {
        return await prisma.email.create({
            data: {
                email:this.email,
                link:this.link,
            }
        })
    }
}