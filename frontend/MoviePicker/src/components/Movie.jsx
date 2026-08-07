import React, { useState, useEffect, useContext } from 'react';
import MovieCard from '../elements/MovieCard';
import Modal from '../elements/Modal';
import no_image from "../assets/no_image.png"
import { useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";
import RoomContext from '../context/RoomContext';

import api from "../utils/apiInstance";
import { ApiPaths } from "../utils/apiPaths";
import toast from "react-hot-toast";

function Movie() {
  const navigate = useNavigate();
  const [selectMovie, setSelectMovie] = useState(null);

  const [search, setSearch] = useState("");
  const [searchedMovie, setSearchedMovie] = useState([]);
  const [loading, setLoading] = useState(false);

  const [roomStatus, setRoomStatus] = useState("");

  const { roomCode, nickname, isHost } = useContext(RoomContext);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        `Bearer ${import.meta.env.VITE_API_CODE}`,
    },
  };

  useEffect(() => {
    if (!search.trim()) {
      setSearchedMovie([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            search
          )}&language=en-US&page=1`,
          options
        );

        const data = await res.json();
        setSearchedMovie(data.results || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);


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

  const handleStartVoting = async () => {
    try {
      const res = await api.patch(
        ApiPaths.ROOM.PARTICIPANT_READY_TO_VOTE(roomCode, nickname)
      );

      setRoomStatus(res.data.data.status);
      navigate("/room")

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };


  return (
    <div className="p-2 lg:px-8 flex flex-col gap-6">

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6  mt-7 lg:px-3">

        <div className="flex items-center bg-white rounded-2xl px-2 h-10 lg:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="flex-1 px-2 outline-none"
          />
          <FaSearch />
        </div>

        <button
          onClick={handleStartVoting}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-xl font-semibold"
        >
          Start Voting
        </button>


      </div>



      {/* Search Results */}
      {search.trim() ? (
        <>
          <h1 className="text-3xl font-bold text-white px-4 lg:px-8">
            Search Results
          </h1>

          {loading ? (
            <p className="text-white text-center mt-10">Searching...</p>
          ) : searchedMovie.length === 0 ? (
            <p className="text-white text-center mt-10">No movies found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 lg:px-8">
              {searchedMovie.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectMovie(movie)}
                  className="cursor-pointer hover:scale-105 transition duration-300"
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : no_image
                    }
                    alt={movie.title}
                    className="w-full h-72 object-cover rounded-xl"
                  />

                  <h2 className="text-white font-semibold mt-2 text-center line-clamp-1">
                    {movie.title}
                  </h2>

                  <p className="text-gray-400 text-center">
                    {movie.release_date?.slice(0, 4)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <MovieCard
            endpoint={"/movie/popular?language=en-US&page=1"}
            title={"Popular"}
            onMovieClick={setSelectMovie}
          />

          <MovieCard
            endpoint={"/movie/top_rated?language=en-US&page=1"}
            title={"Top Rated"}
            onMovieClick={setSelectMovie}
          />

          <MovieCard
            endpoint={"/discover/movie?with_original_language=hi&sort_by=popularity.desc"}
            title={"Bollywood"}
            onMovieClick={setSelectMovie}
          />

          <MovieCard
            endpoint={"/discover/movie?with_original_language=en&sort_by=revenue.desc"}
            title={"Hollywood"}
            onMovieClick={setSelectMovie}
          />

          <MovieCard
            endpoint={"/discover/movie?with_genres=35&sort_by=popularity.desc&page=1"}
            title={"Comedy"}
            onMovieClick={setSelectMovie}
          />

          <MovieCard
            endpoint={"/discover/movie?with_genres=28&sort_by=popularity.desc&page=1"}
            title={"Action"}
            onMovieClick={setSelectMovie}
          />

          <MovieCard
            endpoint={"/discover/movie?with_genres=16&sort_by=popularity.desc&page=1"}
            title={"Animation"}
            onMovieClick={setSelectMovie}
          />
        </>
      )}

      {selectMovie && (
        <Modal
          movie={selectMovie}
          isClose={() => setSelectMovie(null)}
        />
      )}
    </div>
  );
}

export default Movie;