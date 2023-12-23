import prisma from "../lib/prisma";

class UserService {
  static async getUserKeywords(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.keywords) {
      // Keywords are stored as a comma-separated string
      return user.keywords.split(",").map((keyword: string) => keyword.trim());
    }

    return [];
  }

  static async getUserByEmail(email: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      defaultCurrency: user.defaultCurrency,
      role: user.role,
      keywords: user.keywords
        ? user.keywords.split(",").map((kw) => kw.trim())
        : [],
    };
  }

  static async updateUser(email: string, updateData: any): Promise<any> {
    const updateFields: {
      email?: string;
      defaultCurrency?: string;
      keywords?: string;
    } = {};

    if (updateData.email) {
      updateFields.email = updateData.email;
    }
    if (updateData.defaultCurrency) {
      updateFields.defaultCurrency = updateData.defaultCurrency;
    }
    if (updateData.keywords) {
      updateFields.keywords = updateData.keywords.join(",");
    }

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: updateFields,
    });

    if (!updatedUser) {
      throw new Error("Unable to update user profile");
    }

    return {
      email: updatedUser.email,
      defaultCurrency: updatedUser.defaultCurrency,
      keywords: updatedUser.keywords
        ? updatedUser.keywords.split(",").map((kw) => kw.trim())
        : [],
    };
  }
}

export default UserService;
