import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'

import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'

export async function gymsCheckIns(app: FastifyInstance) {
  // TODAS AS ROTAS ABAIXO DESSE HOOK VÃO CHAMAR O MIDDLEWARE DE VERIFICAÇÃO JWT
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-ins/:checkInId/validate', validate)
}
