import React, { useContext, useEffect, useState } from "react";
import api from "../utils/apiInstance";
import { ApiPaths } from "../utils/apiPaths";
import RoomContext from "../context/RoomContext";
import toast from "react-hot-toast";
import no_image from "../assets/no_image.png";

import socket from '../utils/socket.js';


function Result() {
  const { roomCode } = useContext(RoomContext);

  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState([]);


  useEffect(() => {
    const getWinner = async () => {
      try {
        const res = await api.get(
          ApiPaths.MOVIE.WINNING_MOVIE(roomCode)
        );

        setWinners(res.data.data.winner || []);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load result"
        );
      } finally {
        setLoading(false);
      }
    };

    getWinner();
  }, [roomCode]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-white text-3xl">
        Counting Votes...
      </div>
    );
  }

  if (winners.length === 0) {
    return (
      <div className="h-screen flex justify-center items-center text-white text-3xl">
        No Winner Found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5">

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-white text-4xl font-bold">
          Winner
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {winners.map((movie) => (
          <div
            key={movie._id}
            className="relative border-2 border-yellow-500 rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/40 w-80 lg:w-[400px] lg:h-[560px]"
          >
            <img
              src={movie.poster || no_image}
              alt={movie.title}
              className="w-full h-full object-fill"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

            {/* Movie Details */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="mt-5 flex justify-between items-center">

                <span className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold">
                  {movie.votes} Vote{movie.votes !== 1 ? "s" : ""}
                </span>

              </div>
            </div>

          </div>
        ))}
      </div>

      {winners.length > 1 && (
        <p className="mt-8 text-2xl text-yellow-300 font-semibold">
           It's a Tie!
        </p>
      )}
    </div>
  );
}

export default Result;