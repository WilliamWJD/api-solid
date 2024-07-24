import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'

import { CheckInUseCase } from './check-in'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { UsersRepository } from '@/repositories/usersRepository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInRepository: InMemoryCheckInsRepository
let userRepository: UsersRepository
let gymsRepository: InMemoryGymsRepository

let checkInUseCase: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    gymsRepository = new InMemoryGymsRepository()

    checkInRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-22.7671207),
      longitude: new Decimal(-47.1424631),
    })

    // MOCK DA DATAS
    vi.useFakeTimers()
  })

  afterEach(() => {
    // RESETA PARA O PADRÃO REAL
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password_hash: await hash('123456789', 6),
    })

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: createdUser.id,
      userLatitude: -22.7671207,
      userLongitude: -47.1424631,
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7671207,
      userLongitude: -47.1424631,
    })

    expect(async () => {
      await checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -22.7671207,
        userLongitude: -47.1424631,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7671207,
      userLongitude: -47.1424631,
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -22.7671207,
      userLongitude: -47.1424631,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password_hash: await hash('123456789', 6),
    })

    expect(async () => {
      await checkInUseCase.execute({
        gymId: 'gym-01',
        userId: createdUser.id,
        userLatitude: -22.8264743,
        userLongitude: -47.1849677,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
