import { UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const YourAccount = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle the back button click
  const handleBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  return (
    <div className="w-full h-screen relative flex justify-center items-center">
      {/* Cross button at the top-left */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-3xl bg-gray-200 px-3 py-1 hover:cursor-pointer rounded-full  text-gray-600 hover:text-gray-800"
      >
        &times; {/* "×" represents the cross sign */}
      </button>

      {/* UserProfile component */}
      <UserProfile className="w-full h-full" />
    </div>
  );
};

export default YourAccount;
