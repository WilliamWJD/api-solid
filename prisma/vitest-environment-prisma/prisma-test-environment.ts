import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { URL } from 'node:url'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    const schema = randomUUID()
    const databaseUrl = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseUrl

    // NO MOMENTO DE EXECUÇÃO DO TESTE O PRISMA NÃO PODE COMPRAR O SCHEMA LOCAL COM O BANCO LOCAL
    // DEPLOY PULA A VERIFICAÇÃO DE EXISTENCIA DE ALGO NOVO NA BASE DE DADOS
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$queryRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
