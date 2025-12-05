import { SignUp } from "@clerk/nextjs";

const SignUpPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <SignUp afterSignUpUrl="/sign-in" />
    </div>
  );
};

export default SignUpPage;
