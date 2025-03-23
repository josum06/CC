import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("User object:", user);

      const email = user?.primaryEmailAddress?.emailAddress || null;

      if (!user.id || !email) {
        console.error("User ID or Email is missing.");
        return;
      }

      fetch("https://campus-connect-wi6v.onrender.com/api/auth/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("User saved:", data))
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [user]);

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5,
        repeat: Infinity, // Makes the animation loop continuously
        repeatType: "reverse", // Reverses the animation direction for a smooth bounce
      }}
      className="text-[100px] flex items-center fixed inset-0 justify-center"
    >
      Hello {user?.fullName}
    </motion.div>
  );
}

export default Home;
