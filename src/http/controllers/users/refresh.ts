import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({
    onlyCookie:
      true /* valida que o usuario esta autenticado, mas n olha o authorization Bearer */,
  })

  const { role } = request.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true, // não permite que o front consiga pegar o valor
      sameSite: true, // so vai ser acessível dentro do mesmo dominio,
      httpOnly: true, // só vai ser acessível dentro do backend
    })
    .status(201)
    .send({ token })
}
