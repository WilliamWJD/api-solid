import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'

export async function gymsRoutes(app: FastifyInstance) {
  // TODAS AS ROTAS ABAIXO DESSE HOOK VÃO CHAMAR O MIDDLEWARE DE VERIFICAÇÃO JWT
  app.addHook('onRequest', verifyJWT)
}
