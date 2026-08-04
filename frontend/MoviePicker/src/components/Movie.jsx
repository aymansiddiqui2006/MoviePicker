import React, { useState } from 'react'
import MovieCard from '../elements/MovieCard';

import { FaSearch } from "react-icons/fa";
import Modal from '../elements/Modal';



function Movie() {
  const [selectMovie, setSelectMovie] = useState(null);

  return (
    <div className='p-2 flex flex-col gap-6'>
      <div className='flex justify-center'>
        <div className='flex items-center bg-white rounded-2xl px-2 h-10 lg:w-80 justify-between' >
          <input type="text" placeholder='search movies..' className='py-1.5 px-2.5 font-medium outline-none' />
          <FaSearch className='text-xl' />
        </div>

      </div>
      <MovieCard endpoint={"/movie/popular?language=en-US&page=1"} title={"Popular"} onMovieClick={setSelectMovie} />
      <MovieCard endpoint={"/movie/top_rated?language=en-US&page=1"} title={"Top Rated"} onMovieClick={setSelectMovie} />
      <MovieCard endpoint={"/discover/movie?with_original_language=hi&sort_by=popularity.desc"} title={"Bollywood"} onMovieClick={setSelectMovie} />
      <MovieCard endpoint={"/discover/movie?with_original_language=en&sort_by=revenue.desc"} title={"Hollywood"} onMovieClick={setSelectMovie} />
      <MovieCard endpoint={"/discover/movie?with_genres=35&sort_by=popularity.desc&page=1"} title={"Comedy"} onMovieClick={setSelectMovie} />
      <MovieCard endpoint={"/discover/movie?with_genres=28&sort_by=popularity.desc&page=1"} title={"Action"} onMovieClick={setSelectMovie} />
      <MovieCard endpoint={"/discover/movie?with_genres=16&sort_by=popularity.desc&page=1"} title={"Animation"} onMovieClick={setSelectMovie} />


      {
        selectMovie &&
        <Modal movie={selectMovie} isClose={() => setSelectMovie(null)} />
      }



    </div>
  )
}

export default Movie