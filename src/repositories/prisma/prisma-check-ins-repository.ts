import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../checkInsRepository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    throw new Error('Method not implemented.')
  }
}
