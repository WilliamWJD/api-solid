import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, expectTypeOf, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Featch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'teste',
      phone: '12345789',
      latitude: -22.8309341,
      longitude: -47.1699428,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'teste',
      phone: '12345789',
      latitude: -23.1628846,
      longitude: -47.0570838,
    })

    const { gymns } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -22.8288579,
      userLongitude: -47.1699097,
    })

    expect(gymns).toHaveLength(1)
    expect(gymns).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
