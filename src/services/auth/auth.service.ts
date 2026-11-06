import bcrypt from "bcrypt"
import prisma from "../../utils/prisma.js"

export async function registerUser(email:string, password:string){

    const hashedPassword = await bcrypt.hash(password, 12)

    return await prisma.user.create({
        data: {
            email: email.trim().toLocaleLowerCase(),
            password: hashedPassword
        },
        select:{
            id: true,
            email: true,
            createdAt: true
        }
    })
}

/*
Understand the important parts
1. bcrypt.hash(password, 12) hashes the password using a cost factor of 12.
2. prisma.user.create() saves the new user in PostgreSQL.
3. select ensures the returned user object does not include the password hash.
4. Normalizing the email helps keep email addresses consistent.
*/

export async function getUsers(){
    return await prisma.user.findMany()
}