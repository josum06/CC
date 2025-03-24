import React from 'react'
import { useNavigate } from "react-router-dom";

function Chats() {
  const navigate = useNavigate();
  return (
  
       <div className="w-full h-screen relative flex justify-center items-center">
      {/* Cross button at the top-left */}
      <button
        onClick={() => {
          navigate("/Home")
          
        }}
        className="absolute top-4 left-4 text-3xl bg-gray-200 px-3 py-1 hover:cursor-pointer rounded-full  text-gray-600 hover:text-gray-800"
      >
        &times; {/* "×" represents the cross sign */}
      </button>
      <h1>i am chat</h1>
      </div>
   
  )
}

export default Chats
