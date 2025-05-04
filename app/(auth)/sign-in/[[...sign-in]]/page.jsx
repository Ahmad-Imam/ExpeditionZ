import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignIn
        signInFallbackRedirectUrl="/"
        // signInForceRedirectUrl="/onboarding"
      />
    </div>
  );
}
