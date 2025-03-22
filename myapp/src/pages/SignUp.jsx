import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          formFieldLabel: "text-lg font-bold",
        },
      }}
      signUpFields={[
        { label: "Enrollment Number", id: "enrollmentNumber", type: "text" },
        { label: "Full Name", id: "fullName", type: "text" },
      ]}
    />
  );
}
