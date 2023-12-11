import prisma from "../src/lib/prisma";

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

    // Add Bitcoin to Cryptocurrency
    await prisma.cryptocurrency.upsert({
        where: { fullName: 'Bitcoin' },
        update: {},
        create: {
            fullName: 'Bitcoin',
            slugName: 'BTC',
            imageUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
        },
    });

    await prisma.cryptocurrency.upsert({
        where: { fullName: 'Ethereum' },
        update: {},
        create: {
            fullName: 'Ethereum',
            slugName: 'ETH',
            imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
        },
    });
    await prisma.cryptocurrency.upsert({
        where: { fullName: 'Doge coin' },
        update: {},
        create: {
            fullName: 'Doge coin',
            slugName: 'DOGE',
            imageUrl: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png?1547792256',
        },
    });
    await prisma.cryptocurrency.upsert({
        where: { fullName: 'Stable coin' },
        update: {},
        create: {
            fullName: 'Stable coin',
            slugName: 'USDT',
            imageUrl: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707',
        },
    });


    // Create feeds
    await prisma.feed.upsert({
        where: { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
        update: {},
        create: {
            url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
            name: 'CoinDesk',
            languageName: 'english',
        },
    });

    await prisma.feed.upsert({
        where: { url: 'https://cointelegraph.com/rss' },
        update: {},
        create: {
            url: 'https://cointelegraph.com/rss',
            name: 'CoinTelegraph',
            languageName: 'english',
        },
    });

    await prisma.feed.upsert({
        where: { url: 'https://the-blog.fr/feed/' },
        update: {},
        create: {
            url: 'https://the-blog.fr/feed/',
            name: 'The Blog FR',
            languageName: 'french',
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
