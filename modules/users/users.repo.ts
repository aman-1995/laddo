import { prisma } from "@/lib/db/prisma";

export const usersRepo = {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async update(id: string, data: Partial<{ name: string; phone: string }>) {
    return prisma.user.update({ where: { id }, data });
  },
};
