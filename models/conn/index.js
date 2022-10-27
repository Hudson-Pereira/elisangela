const PrismaClient = require("@prisma/client");

async function main() {
  // Connect the client
  await PrismaClient.$connect()
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await PrismaClient.$disconnect()
      })
  .catch(async (e) => {
    console.error(e)
    await PrismaClient.$disconnect()
    process.exit(1)
  })