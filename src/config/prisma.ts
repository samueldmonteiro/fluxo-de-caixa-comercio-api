import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../generated/prisma/client'

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

const adapter = new PrismaMariaDb({
  host: requiredEnv('DB_HOST'),
  port: Number(requiredEnv('DB_PORT')),
  user: process.env.DB_USER || 'root',
  password: requiredEnv('DB_PASSWORD'),
  database: requiredEnv('DB_DATABASE'),
  connectionLimit: 5
})

const prisma = new PrismaClient({ adapter })

export default prisma
