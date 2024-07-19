import { expect, describe, it, beforeAll } from 'vitest'
import { compare } from 'bcryptjs'

import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  // beforeAll(() => {})

  it('should be able to register user', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456789',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'john@email.com',
      password: '123456789',
    })

    const isPasswordCorrectHashed = await compare(
      '123456789',
      user.password_hash,
    )

    expect(isPasswordCorrectHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'john@email.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456789',
    })

    expect(async () => {
      await registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456789',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
