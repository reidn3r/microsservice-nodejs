import { prisma } from "../../lib/prisma";

export class UserRepository{
    async findUserByEmail(email:string){
        return await prisma.user.findUnique({ where:{ email:email } });
    }

    async createNewUser(name:string, email:string, password:string){
        return await prisma.user.create({
            data:{
                name, 
                email,
                password
            }
        })
    }

    async findAllUsers(){
        return await prisma.user.findMany({
            select:{
                id: true,
                email:true,
                name:true,
                createdAt: true
            }
        })
    }
}