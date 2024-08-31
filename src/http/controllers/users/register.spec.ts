import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    // verifica se de fato a aplicação foi inicializada
    await app.ready()
  })

  afterAll(async () => {
    // aguarda a aplicação encerrar
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Johm Doe',
      email: 'johndow@example.com.br',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
