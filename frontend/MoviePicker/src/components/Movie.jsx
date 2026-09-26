import { useState, useEffect, useContext } from 'react';
import MovieCard from '../elements/MovieCard';
import Modal from '../elements/Modal';
import no_image from "../assets/no_image.png"
import { useNavigate } from "react-router-dom";

import { ImCheckboxChecked } from "react-icons/im";

import { FaSearch } from "react-icons/fa";
import RoomContext from '../context/RoomContext';

import api from "../utils/apiInstance";
import { ApiPaths } from "../utils/apiPaths";
import toast from "react-hot-toast";
import socket from '../utils/socket';
import ConfirmModal from '../elements/ConfirmModal';

function Movie() {
  const navigate = useNavigate();
  const [selectMovie, setSelectMovie] = useState(null);
  const [confirmSelect, setConfirmSelect] = useState(false);

  const [search, setSearch] = useState("");
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovieLength, setSelectedMovieLength] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState([]);

  const [roomStatus, setRoomStatus] = useState("");

  const { roomCode, nickname } = useContext(RoomContext);


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
    const handleRoomUpdate = (room) => {
      if (room.status === "voting") {
        navigate("/vote");
      }
    };

    socket.on("room-updated", handleRoomUpdate);

    return () => {
      socket.off("room-updated", handleRoomUpdate);
    };
  }, [navigate]);

  const fetchSelectedMovie = async () => {
    try {
      const res = await api.get(ApiPaths.PARTICIPANT.GET_SELECTED_MOVIE(roomCode, nickname));

      const movies = res.data?.data;

      setSelectedMovie(movies);
      setSelectedMovieLength(movies.length);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch selected movies");
    }
  }



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

  const handleRemoveFromSelected = async (tmdbId) => {
    try {
      await api.delete(ApiPaths.PARTICIPANT.REMOVE_SELECTED_MOVIE(roomCode, nickname, tmdbId));

      fetchSelectedMovie();

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete selected movies");
    }
  }


  return (
    <div className="p-2 lg:px-8 flex flex-col gap-6">

      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6  mt-7 lg:px-3">

        <div className={`${openSearchBar ? "p-2 rounded-2xl" : "p-2.5 rounded-full"} flex justify-between items-center bg-white  lg:w-80`}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className={` ${openSearchBar ? "flex" : "hidden"} md:flex px-2 outline-none`}
          />

          <FaSearch className='cursor-pointer text-lg hover:text-gray-500 md:pointer-events-none' onClick={() => { setOpenSearchBar(!openSearchBar) }} />
        </div>

        <button
          onClick={() => setConfirmSelect(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-xl font-semibold"
        >
          {openSearchBar ? "Vote" : "Start Voting"}
        </button>


      </div>

      <div className='text-white font-medium flex justify-center md:justify-start md:text-lg'>
        Total Movie Selected : {selectedMovieLength}/5
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
            category={"popular"}
          />

          <MovieCard
            endpoint={"/movie/top_rated?language=en-US&page=1"}
            title={"Top Rated"}
            onMovieClick={setSelectMovie}
            category={"top-rated"}
          />

          <MovieCard
            endpoint={"/discover/movie?with_original_language=hi&sort_by=popularity.desc"}
            title={"Bollywood"}
            onMovieClick={setSelectMovie}
            category={"bollywood"}
          />

          <MovieCard
            endpoint={"/discover/movie?with_original_language=en&sort_by=revenue.desc"}
            title={"Hollywood"}
            onMovieClick={setSelectMovie}
            category={"hollywood"}
          />

          <MovieCard
            endpoint={"/discover/movie?with_genres=35&sort_by=popularity.desc&page=1"}
            title={"Comedy"}
            onMovieClick={setSelectMovie}
            category={"comedy"}
          />

          <MovieCard
            endpoint={"/discover/movie?with_genres=28&sort_by=popularity.desc&page=1"}
            title={"Action"}
            onMovieClick={setSelectMovie}
            category={"action"}
          />

          <MovieCard
            endpoint={"/discover/movie?with_genres=16&sort_by=popularity.desc&page=1"}
            title={"Animation"}
            onMovieClick={setSelectMovie}
            category={"animation"}
          />
        </>
      )}

      {selectMovie && (
        <Modal
          movie={selectMovie}
          isClose={() => setSelectMovie(null)}
          onMovieAdded={fetchSelectedMovie}
        />
      )}

      {
        confirmSelect && (
          <ConfirmModal title={"Movie Selected"} isClose={() => setConfirmSelect(false)}>
            <div className='flex flex-col gap-5'>
              <div className=' font-medium flex justify-center md:justify-start '>
                Total Movie Selected : {selectedMovieLength}/5
              </div>
              <div className='flex gap-3 overflow-x-scroll scrollbar-none p-3.5'>
                {
                  selectedMovie.map((movie) => (
                    <div key={movie._id} className='relative h-42 min-w-[49%] md:h-48 md:min-w-[23%] lg:h-72'>
                      <div className='absolute -right-1 -top-1 z-20'>
                        <ImCheckboxChecked className='text-green-700 text-2xl cursor-pointer shadow-2xl hover:scale-90' onClick={() => handleRemoveFromSelected(movie.tmdbId)} />
                      </div>
                      <img
                        src={
                          movie.poster
                        }
                        alt={movie.original_title} className='object-fill h-full w-full rounded-xl' />
                    </div>
                  ))
                }
              </div>
              {/* button */}
              <div className='flex justify-end gap-2'>
                <button className='bg-gray-400 rounded-xl py-0.5 px-2.5 hover:scale-90 cursor-pointer text-lg font-semibold' onClick={() => setConfirmSelect(false)}>Edit</button>
                <button className='bg-yellow-500 rounded-xl py-0.5 px-2.5 hover:scale-90 cursor-pointer text-lg font-semibold' onClick={handleStartVoting}>Confirm</button>
              </div>
            </div>
          </ConfirmModal>
        )
      }
    </div>
  );
}

export default Movie;