import prisma from '../lib/prisma';

class UserService {
    static async getUserKeywords(userId: string): Promise<string[]> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user && user.keywords) {
            // Keywords are stored as a comma-separated string
            return user.keywords.split(',').map((keyword: string) => keyword.trim());
        }

        return [];
    }
}

export default UserService;
