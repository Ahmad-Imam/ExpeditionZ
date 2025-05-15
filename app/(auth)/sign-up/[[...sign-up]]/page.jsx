import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "ExpeditionZ - SignUp",
  description: "Create an account to start planning your trips",
};

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <SignUp />
    </div>
  );
}
