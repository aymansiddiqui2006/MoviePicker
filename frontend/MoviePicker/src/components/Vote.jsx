import React from 'react'
import { useEffect, useState, useContext } from 'react';
import api from '../utils/apiInstance';
import { ApiPaths } from '../utils/apiPaths';
import RoomContext from '../context/RoomContext';
import toast from 'react-hot-toast';
import no_image from "../assets/no_image.png"
import { useNavigate } from 'react-router-dom';

import { BiLike, BiDislike } from "react-icons/bi";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";

function Vote() {

  const navigate = useNavigate();

  const { roomCode, nickname, isHost } = useContext(RoomContext);

  const [selectedMovie, setSelectedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [roomStatus, setRoomStatus] = useState("");

  useEffect(() => {
    const getmovies = async () => {

      try {
        const res = await api.get(ApiPaths.MOVIE.GET_MOVIES(roomCode));

        setSelectedMovies(res.data.data || []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false);
      }
    }

    if (roomCode) {
      getmovies();
    }
  }, [roomCode])

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(ApiPaths.ROOM.GET_ROOM(roomCode));
        setRoomStatus(res.data.data.status);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoom();

    const interval = setInterval(fetchRoom, 2000);

    return () => clearInterval(interval);
  }, [roomCode]);


  useEffect(() => {
    if (roomStatus === "counting_vote") {
      navigate("/result");
    }
  }, [roomStatus, navigate]);

  const handleStartCount = async () => {
    try {
      const res = await api.patch(ApiPaths.ROOM.WINNING_COUNT_STARTED(roomCode, nickname));
      setRoomStatus(res.data.data.status);
      toast.success("Counting Started");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-white text-2xl">
        Loading Movies...
      </div>
    );
  }

  if (selectedMovie.length === 0) {
    return (
      <div className="h-screen flex justify-center items-center text-white text-2xl">
        No Movies Available
      </div>
    );
  }

  if (currentIndex >= selectedMovie.length) {
    if (!voted) {
      return (
        <div className="h-screen flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold">Please Vote</h1>
          <p className="text-gray-300 mt-3">
            vote any one of the movie
          </p>
          <button className='text-4xl text-white cursor-pointer mt-4' onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))
          }><FaArrowCircleLeft /></button>
        </div>
      );
    }
    return (
      <div className="h-screen flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-bold">Voting Completed!</h1>
        <p className="text-gray-300 mt-3">
          Waiting for other participants...
        </p>
        {isHost && roomStatus === "voting" && (
          <button
            onClick={handleStartCount}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-xl font-semibold mt-5"
          >
            Start count
          </button>
        )}
      </div>
    );
  }


  const movie = selectedMovie[currentIndex];

  const handlevote = async (tmdbId) => {
    try {

      setVoting(true);
      await api.patch(ApiPaths.MOVIE.VOTE_MOVIE(roomCode, tmdbId, nickname))
      toast.success("Vote Added");
      setVoted(true)

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setVoting(false);
    }
  }



  return (

    <div className='flex flex-col items-center justify-center p-2'>
      <div className='mt-5 flex flex-col mb-4 gap-0.5 items-center'>
        <p className="text-white text-2xl lg:text-3xl font-bold">
          Movie {currentIndex + 1} / {selectedMovie.length}
        </p>
        <p className='text-white font-semibold text-sm lg:text-lg'>You one vote one movie</p>

      </div>

      <div>

        <div key={movie._id} className='relative border-2 border-gray-400 w-80 lg:w-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg shadow-gray-500'>
          <img src={movie.poster || no_image} alt={movie.title} className='object-fill h-full w-full' />

          <div className="absolute bottom-0 left-0 right-0 flex justify-between p-3">
            <button className='hover:bg-red-500/35 p-2 rounded-3xl lg:rounded-4xl hover:scale-110 cursor-pointer' onClick={() => setCurrentIndex(prev => prev + 1)}>
              <BiDislike className="text-red-500 text-3xl lg:text-5xl" />
            </button>

            <button className='hover:bg-green-600/35 p-2 rounded-3xl lg:rounded-4xl hover:scale-110 cursor-pointer' onClick={() => handlevote(movie.tmdbId)}>
              <BiLike className="text-green-500 text-3xl lg:text-5xl" />
            </button>
          </div>

        </div>

        <div className='flex mt-8 justify-between px-3.5'>
          <button className='text-4xl text-white cursor-pointer' onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))
          }><FaArrowCircleLeft /></button>

          <button className='text-4xl text-white cursor-pointer' onClick={() =>
            setCurrentIndex(prev =>
              Math.min(prev + 1, selectedMovie.length)
            )}><FaArrowCircleRight /></button>
        </div>

      </div>


    </div>
  )
}

export default Vote