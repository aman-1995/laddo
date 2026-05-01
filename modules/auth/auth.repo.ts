import { prisma } from "@/lib/db/prisma";

export const authRepo = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
};
