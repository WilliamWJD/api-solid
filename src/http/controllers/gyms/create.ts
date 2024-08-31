import { MakeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGym = MakeCreateGymUseCase()

  await createGym.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })
}
