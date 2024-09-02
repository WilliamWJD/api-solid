import { MakeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchea = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchea.parse(request.query)

  const searchGymsUseCase = MakeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({ page, query: q })

  return reply.status(201).send({
    gyms,
  })
}
