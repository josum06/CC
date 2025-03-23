import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetch("http://localhost:3000/api/auth/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.primaryEmailAddress?.emailAddress,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User saved:", data))
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [user]);
  return <div>hello</div>;
}

export default Home;
