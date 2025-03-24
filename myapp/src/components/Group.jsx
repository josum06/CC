// Group.jsx
import { useState } from "react";

const Group = ({ group }) => {
  const [joined, setJoined] = useState(false);

  const handleJoinGroup = () => {
    setJoined(!joined);
  };

  return (
    <div className=" bg-white p-4 mb-4 rounded shadow-lg">
      <div className=" flex justify-between items-center">
        <div>
          <p className="font-bold">{group.name}</p>
          <p className="text-sm text-gray-500">{group.members} Members</p>
        </div>
        <button
          onClick={handleJoinGroup}
          className={`px-4 py-2 rounded ${
            joined ? "bg-green-500" : "bg-blue-500"
          } text-white`}
        >
          {joined ? "Joined" : "Join Now"}
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">{group.topic}</p>
    </div>
  );
};

export default Group;
