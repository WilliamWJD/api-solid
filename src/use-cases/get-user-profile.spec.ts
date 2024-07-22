import { expect, describe, it, beforeEach } from 'vitest'

import { GetUserProfileUseCase } from './get-user-profile'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resources-not-found-error'

let userRepository: InMemoryUsersRepository
let getuserprofileUseCase: GetUserProfileUseCase

describe('GetUserProfile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    getuserprofileUseCase = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await userRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password_hash: await hash('123456789', 6),
    })

    const { user } = await getuserprofileUseCase.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(async () => {
      await getuserprofileUseCase.execute({
        userId: 'non-existing-id',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
