import { expect, describe, it, beforeEach } from 'vitest'

import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymRepository)
  })

  it('should be able to register gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Gym Teste',
      description: 'teste',
      phone: '12345789',
      latitude: -22.7671207,
      longitude: -47.1424631,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
