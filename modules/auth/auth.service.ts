import { auth } from "@/lib/auth/auth";
import { AppError } from "@/lib/errors/app-error";
import type { SessionUser } from "./auth.types";

export const authService = {
  async requireSession(): Promise<SessionUser> {
    const session = await auth();
    if (!session?.user?.id) throw AppError.unauthorized();
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    };
  },
};
