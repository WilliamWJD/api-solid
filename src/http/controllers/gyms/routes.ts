import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  // TODAS AS ROTAS ABAIXO DESSE HOOK VÃO CHAMAR O MIDDLEWARE DE VERIFICAÇÃO JWT
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', search)
  app.get('/gyums/nearby', nearby)

  app.post('/gyms', create)
}
