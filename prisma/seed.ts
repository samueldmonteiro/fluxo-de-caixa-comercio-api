import 'dotenv/config';
import prisma from '../src/config/prisma'
import * as bcrypt from 'bcryptjs';

async function main() {
  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: 'USER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create Categories
  let category1 = await prisma.category.findFirst({
    where: { name: "Pagamento da assistente" }
  });

  if (!category1) {
    category1 = await prisma.category.create({
      data: { name: "Pagamento da assistente" }
    });
  }

  let category2 = await prisma.category.findFirst({
    where: { name: "Compra de mercadoria do mês" }
  });

  if (!category2) {
    category1 = await prisma.category.create({
      data: { name: "Compra de mercadoria do mês" }
    });
  }

  let category3 = await prisma.category.findFirst({
    where: { name: "Fechando do dia" }
  });

  if (!category3) {
    category1 = await prisma.category.create({
      data: { name: "Fechando do dia" }
    });
  }

  // Create Movements
  const movement1 = await prisma.movement.upsert({
    where: { id: 1 },
    update: {},
    create: {
      type: 'INCOME',
      value: 350,
      userId: 1,
      categoryId: 3
    },
  });

  const movement2 = await prisma.movement.upsert({
    where: { id: 2 },
    update: {},
    create: {
      type: 'EXPENSE',
      value: 800,
      userId: 1,
      categoryId: 2
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });