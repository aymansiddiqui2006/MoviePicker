import React, { useState, useEffect } from 'react';
import MovieCard from '../elements/MovieCard';
import Modal from '../elements/Modal';
import no_image from "../assets/no_image.png"

import { FaSearch } from "react-icons/fa";

function Movie() {
  const [selectMovie, setSelectMovie] = useState(null);

  const [search, setSearch] = useState("");
  const [searchedMovie, setSearchedMovie] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-2 flex flex-col gap-6">

      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="flex items-center bg-white rounded-2xl px-2 h-10 lg:w-80">

          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-1.5 px-2.5 font-medium outline-none"
          />

          <FaSearch className="text-xl" />
        </div>
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
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || no_image}
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