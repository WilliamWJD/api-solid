import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Profile e2e', () => {
  beforeAll(async () => {
    // verifica se de fato a aplicação foi inicializada
    await app.ready()
  })

  afterAll(async () => {
    // aguarda a aplicação encerrar
    await app.close()
  })

  it('Should be able to get profile', async () => {
    await request(app.server).post('/users').send({
      name: 'Johm Doe',
      email: 'johndoe@example.com.br',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com.br',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com.br',
      }),
    )
  })
})
