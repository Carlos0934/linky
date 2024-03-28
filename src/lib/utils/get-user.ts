import { getServerSession } from "next-auth";
import { authOptions } from "../auth/config";

export const getUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  return session.user!;
};
