import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class UserRepository {
    findByEmail = async (email) => {
        const user = await this.prisma.findFirst({
            where: {
                email: email,
            },
        })
        return user
    }

    createUser = async (email, password, name) => {
        const user = await this.prisma.users.create({
            email,
            password,
            name,
        })
        return user
    }

    findUserById = async (userId) => {
        const user = await this.prisma.findFirst({
            where: {
                userId: Number(userId),
            },
        })
        return user
    }
}
