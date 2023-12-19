import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient();

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export default prisma;
