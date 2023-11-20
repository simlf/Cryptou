import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Create roles
    const adminRole = await prisma.role.create({
        data: { role: 'admin' },
    });

    const userRole = await prisma.role.create({
        data: { role: 'user' },
    });

    // Create users
    await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: 'securepassword',
            defaultCurrency: 'EUR',
            role: adminRole.id,
        },
    });

    await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: 'securepassword',
            defaultCurrency: 'EUR',
            role: userRole.id,
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
