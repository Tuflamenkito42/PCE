import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing Prisma connection...')
        const users = await prisma.user.findMany({ take: 1 })
        console.log('Success! Users found:', users.length)
    } catch (e) {
        console.error('Prisma Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
