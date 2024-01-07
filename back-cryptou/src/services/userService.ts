import prisma from '../lib/prisma';

class UserService {
    static async getUserKeywords(userId: any): Promise<string[]> {
        console.debug(userId);
        const user = await prisma.user.findUnique({
            where: { email: userId.email },
        });

        if (user && user.keywords) {
            // Keywords are stored as a comma-separated string
            return user.keywords.split(',').map((keyword: string) => keyword.trim());
        }

        return [];
    }
}

export default UserService;
