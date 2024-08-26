import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../usersRepository'

export class PrismaUsersRepository implements UsersRepository {
  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }
}
