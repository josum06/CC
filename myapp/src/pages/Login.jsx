import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-green-400 tracking-wider">Campus Connect</h1>
        <p className="text-gray-400 mt-2">Welcome back! Please sign in to continue.</p>
      </div>
      <div className="w-full max-w-md flex justify-center">
        <SignIn
          signUpUrl="/SignUp"
          appearance={{
            variables: {
              colorPrimary: "#22c55e",
              colorBackground: "#111111",
              colorText: "white",
              colorInputBackground: "#212328",
              colorInputText: "white",
            },
            elements: {
              card: "bg-[#111111] border border-gray-700 shadow-none",
              headerTitle: "text-white text-3xl font-bold",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "border-gray-600 hover:bg-gray-700 text-white",
              dividerLine: "bg-gray-600",
              dividerText: "text-gray-400",
              formFieldLabel: "text-lg font-bold text-white",
              formFieldInput:
                "bg-[#212328] border-gray-600 text-white focus:ring-green-500 focus:border-green-500",
              formButtonPrimary:
                "bg-green-500 hover:bg-green-600 text-lg normal-case font-bold text-black",
              footerActionText: "text-gray-400",
              footerActionLink: "text-green-400 hover:text-green-500",
            },
          }}
        />
      </div>
    </div>
  );
}
