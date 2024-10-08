import { expect, describe, it, beforeEach } from 'vitest'

import { AuthenticateUseCase } from './authenticate'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { hash } from 'bcryptjs'

let userRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password_hash: await hash('123456789', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'john@email.com',
      password: '123456789',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    expect(async () => {
      await authenticateUseCase.execute({
        email: 'john@email.com',
        password: '123456789',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'john@email.com',
      password_hash: await hash('123456', 6),
    })

    expect(async () => {
      await authenticateUseCase.execute({
        email: 'john@email.com',
        password: '1234',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
