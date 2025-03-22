import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn
        signUpUrl="/SignUp"
        appearance={{
          elements: {
            formFieldLabel: "text-lg font-bold",
            card: "shadow-xl rounded-2xl",
            formButtonPrimary: "bg-blue-500 text-white hover:bg-blue-600",
          },
        }}
      />
    </div>
  );
}
