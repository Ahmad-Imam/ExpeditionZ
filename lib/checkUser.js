import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedUser) {
      return user;
    }
    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        email: user.emailAddresses[0].emailAddress,
        imageUrl: user.imageUrl,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
