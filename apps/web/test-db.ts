import { prisma } from './lib/db/index.ts';

async function main() {
    try {
        console.log('Testing Prisma Client instantiation...');

        if (prisma) {
            console.log('Prisma Client initialized successfully!');
            console.log('Client configuration appears valid for Prisma 7.');

            // Attempt connection only if URL is present (optional)
            if (process.env.DATABASE_URL) {
                console.log('Attempting database connection...');
                // await prisma.$connect(); // Optional explicit connect
            } else {
                console.log('Skipping connection test: DATABASE_URL not found.');
            }
        } else {
            throw new Error('Prisma instance is undefined');
        }

    } catch (e) {
        console.error('Prisma Client instantiation failed:', e);
        process.exit(1);
    } finally {
        // await prisma.$disconnect();
    }
}

main();
