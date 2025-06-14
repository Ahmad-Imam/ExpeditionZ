import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/trips",
  "/trips/new",
  // "/onboarding(.*)",
  // "/create(.*)",
  // "/job(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // if (path === "/" || path === "") {
  //   return NextResponse.next();
  // }

  const { userId } = await auth();

  if (isProtectedRoute(req) && !userId) {
    // return {
    //   redirect: {
    //     destination: "/sign-in",
    //     permanent: false,
    //   },
    // };
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
