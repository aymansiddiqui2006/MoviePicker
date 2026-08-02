import React, { useState } from "react";

import CreateRoom from "../elements/CreateRoom.jsx";
import JoinRoom from "../elements/JoinRoom.jsx";

function Home() {
  const [mode, setMode] = useState("create");

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">

      <div>
        <h1 className="text-5xl lg:text-6xl font-bold text-center mb-2 text-yellow-400">
          Movie Picker
        </h1>

        <p className="text-center text-gray-300 mb-8 text-md lg:text-lg">
          Create a room or join your friends and decide what to watch.
        </p>
      </div>

      <div className=" bg-white/30 backdrop-blur-md rounded-2xl p-5 shadow-2xl w-80">


        <div className="flex justify-center mb-8">

          <div className="w-60 flex items-center justify-between bg-gray-500/65 rounded-xl ">
            <button
              onClick={() => setMode("create")}
              className={`flex-1 w-1/2 py-2 rounded-lg font-semibold transition duration-300 ${mode === "create"
                ? "bg-red-600 text-white"
                : "text-white"
                }`}
            >
              Create
            </button>

            <button
              onClick={() => setMode("join")}
              className={`flex-1 w-1/2 py-2 rounded-lg font-semibold transition duration-300 ${mode === "join"
                ? "bg-red-600 text-white"
                : "text-white"
                }`}
            >
              Join
            </button>
          </div>
        </div>

        {mode === "create" ? <CreateRoom /> : <JoinRoom />}
      </div>
    </div>
  );
}

export default Home;