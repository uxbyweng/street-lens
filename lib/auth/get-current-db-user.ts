import { auth } from "@/auth";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/models/user";

export async function getCurrentDbUser() {
  const session = await auth();
  //   console.log("SESSION:", session);

  if (!session?.user) {
    return null;
  }

  const provider = session.user.provider;
  const providerAccountId = session.user.providerAccountId;

  if (!provider || !providerAccountId) {
    return null;
  }

  await connectDB();

  const dbUser = await User.findOne({
    provider,
    providerAccountId,
  });

  return dbUser;
}
