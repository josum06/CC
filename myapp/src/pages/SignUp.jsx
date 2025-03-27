import { SignUp } from "@clerk/clerk-react";
import {Link} from "react-router-dom";

export default function SignUpPage() {
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            formFieldLabel: "text-lg font-bold",
          },
        }}
        signInUrl="/Login"
        additionalFields={[
          {
            name: "enrollmentNumber",
            label: "Enrollment Number",
            placeholder: "Enter your enrollment number",
            required: true,
          },
          {
            name: "fullName",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
          },
        ]}
      />
    </div>
  );
}
