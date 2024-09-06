import { app } from '@/app'
import { afterAll, beforeAll, describe, it, expect } from 'vitest'
import request from 'supertest'

describe('Refresh Token e2e', () => {
  beforeAll(async () => {
    // verifica se de fato a aplicação foi inicializada
    await app.ready()
  })

  afterAll(async () => {
    // aguarda a aplicação encerrar
    await app.close()
  })

  it('Should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'Johm Doe',
      email: 'johndoe@example.com.br',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com.br',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie') ?? []

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
