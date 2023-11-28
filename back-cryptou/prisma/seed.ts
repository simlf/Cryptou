import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Create or find the 'ADMIN' and 'USER role
    const adminRole = await prisma.role.upsert({
        where: { role: 'admin' },
        update: {},
        create: { role: 'admin' },
    });

    const userRole = await prisma.role.upsert({
        where: { role: 'user' },
        update: {},
        create: { role: 'user' },
    });

    // Create users if they don't exist
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: 'securepassword',
            defaultCurrency: 'EUR',
            role: adminRole.id,
        },
    });

    await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            password: 'securepassword',
            defaultCurrency: 'EUR',
            role: userRole.id,
        },
    });

    // Create feeds
    await prisma.feed.upsert({
        where: { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
        update: {},
        create: {
            url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
            name: 'CoinDesk',
        },
    });

    await prisma.feed.upsert({
        where: { url: 'https://cointelegraph.com/rss' },
        update: {},
        create: {
            url: 'https://cointelegraph.com/rss',
            name: 'CoinTelegraph',
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
