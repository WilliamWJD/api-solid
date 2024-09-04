import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Search e2e', () => {
  beforeAll(async () => {
    // verifica se de fato a aplicação foi inicializada
    await app.ready()
  })

  afterAll(async () => {
    // aguarda a aplicação encerrar
    await app.close()
  })

  it('Should be able to search gym by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '19999999',
        latitude: -22.7671207,
        longitude: -47.1424631,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Some description',
        phone: '19999999',
        latitude: -22.7671207,
        longitude: -47.1424631,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ q: 'JavaScript' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(201)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
