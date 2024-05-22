import { prisma } from "../../lib/prisma";

export class EmailRepository{
    async findConfirmedEmail(email:string){
        return await prisma.email.findFirst({
            where:{
                email:email,
                confirmed: {
                    equals: true
                }
            }
        });
    }

    async findAllByEmail(email:string){
        return prisma.email.findMany({
            where:{
                email
            }
        });
    }

    async confirmEmail(email:string, url:string){
        return await prisma.email.update({
            data:{
                confirmed: true
            },
            where:{
                link_email: {
                    email:email,
                    link:url
                }
            }
        })
    }

    async saveEmailUrlAssociation(email:string, param:string){
        return await prisma.email.create({
            data: {
                email:email,
                link:param,
            }
        })
    }
}