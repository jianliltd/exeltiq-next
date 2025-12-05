import { SignIn } from "@clerk/nextjs";

const SignInPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignIn afterSignInUrl="/dashboard" />
    </div>
  );
};

export default SignInPage;
