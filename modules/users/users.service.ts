import { AppError } from "@/lib/errors/app-error";
import { usersRepo } from "./users.repo";
import type { UpdateUserInput } from "./users.types";

export const usersService = {
  async getUser(id: string) {
    const user = await usersRepo.findById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  },

  async updateUser(id: string, input: UpdateUserInput) {
    const user = await usersRepo.findById(id);
    if (!user) throw AppError.notFound("User not found");
    return usersRepo.update(id, input);
  },
};
