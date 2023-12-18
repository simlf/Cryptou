#!/bin/sh

# Run Prisma migrations
echo "💫 Running Prisma Generation... 💫"
npx prisma generate
echo "🗃️ Running Prisma Migrations... 🗃️"
npx prisma migrate prod
echo "🌱 Running Prisma Seeds... 🌱"
npx prisma db seed
# Start the main application
echo "✅Starting the application... ✅"
exec "$@"
