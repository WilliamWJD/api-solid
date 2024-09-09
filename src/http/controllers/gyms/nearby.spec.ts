import { app } from '@/app'
import { createAndAuthenticateUser } from '@/util/test/create-and-authenticate-user'
import { describe } from 'node:test'
import { afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'

describe('Nearby e2e', () => {
  beforeAll(async () => {
    // verifica se de fato a aplicação foi inicializada
    await app.ready()
  })

  afterAll(async () => {
    // aguarda a aplicação encerrar
    await app.close()
  })

  it('Should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

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
        latitude: -13.4215831,
        longitude: -44.6000822,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.7671207,
        longitude: -47.1424631,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(201)
    expect(response.body.gymns).toHaveLength(1)
    expect(response.body.gymns).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
