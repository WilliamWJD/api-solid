import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Create Gym e2e', () => {
  beforeAll(async () => {
    // verifica se de fato a aplicação foi inicializada
    await app.ready()
  })

  afterAll(async () => {
    // aguarda a aplicação encerrar
    await app.close()
  })

  it('Should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '19999999',
        latitude: -22.7671207,
        longitude: -47.1424631,
      })

    expect(response.statusCode).toEqual(200)
  })
})
