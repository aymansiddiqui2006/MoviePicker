import React, { useState, useEffect } from 'react'


function MovieCard({ title, endpoint, onMovieClick }) {

    const [movies, setMovies] = useState([]);

    const options = {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_API_CODE}` }
    };


    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3${endpoint}`, options)

                const mainRes = await res.json();
                console.log(mainRes)

                setMovies(mainRes.results)

            } catch (error) {
                console.log(error)
            }
        }

        fetchMovie();
    }, [endpoint])


    return (
        <div className='bg-white/45 py-2 px-3 lg:px-5 rounded-xl flex flex-col shadow-md shadow-gray-700'>
            <h1 className='text-2xl font-semibold'>{title}</h1>
            <div className='flex gap-4 overflow-x-scroll scrollbar-none mt-2 px-1 py-2 '>
                {
                    movies.map((movie) => (
                        <div key={movie.id} className='relative rounded-xl  gap-3 h-48 min-w-36 lg:h-72 lg:min-w-56 overflow-hidden hover:scale-105' onClick={() => onMovieClick(movie)}>
                            <img
                                src={
                                    movie.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                        : "/no-image.png"
                                }
                                alt={movie.original_title} className='object-fill h-full w-full' >
                            </img>
                        </div>
                    ))
                }
            </div>
            <h2 className='flex justify-end font-semibold'>View All →</h2>
        </div>
    )
}

export default MovieCard