// prisma/seed.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.counter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, value: 0 },
  });
}

main().finally(() => prisma.$disconnect());