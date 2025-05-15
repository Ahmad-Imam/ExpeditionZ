import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "ExpeditionZ - Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignIn signInFallbackRedirectUrl="/" />
    </div>
  );
}
