import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import categories from '../utils/MovieCategory.js';
import Modal from '../elements/Modal.jsx';
import api from '../utils/apiInstance.js';
import { ApiPaths } from '../utils/apiPaths.js';
import RoomContext from '../context/RoomContext.jsx';
import toast from 'react-hot-toast';

function SeeAllPage() {
    const { category } = useParams();
    const navigate = useNavigate();

    const movieCat = categories[category]
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null)

    const { roomCode, nickname } = useContext(RoomContext)


    const options = {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: `Bearer ${import.meta.env.VITE_API_CODE}` }
    };


    useEffect(() => {
        setLoading(true);
        const fetchMovie = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3${movieCat.endpoint}`, options)

                const mainRes = await res.json();

                setMovies(mainRes.results)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        fetchMovie();
    }, [category])


    if (!movieCat) {
        return <h1 className="text-white text-center mt-10 text-2xl font-bold lg:text-4xl md:text-3xl">Category not found</h1>;
    }


    const handleStartVoting = async () => {
        try {
            const res = await api.patch(
                ApiPaths.ROOM.PARTICIPANT_READY_TO_VOTE(roomCode, nickname)
            );

            navigate("/room")

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    };





    return (

        <div className='w-full h-screen flex items-center justify-center'>
            {loading ? (
                <p className="text-white text-center mt-10 text-2xl font-bold lg:text-4xl md:text-3xl">Loading...</p>
            ) :
                movies.length === 0 ?
                    (
                        <div className="text-white text-center mt-10 text-2xl font-bold lg:text-4xl md:text-3xl">Movies not availble</div>
                    ) : (
                        <div className='w-full h-screen flex flex-col p-5'>

                            <div className='flex justify-between'>
                                <div className='text-2xl lg:text-4xl md:text-3xl font-bold text-white'>{movieCat.title}</div>
                                <button
                                    onClick={handleStartVoting}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-xl font-semibold"
                                >
                                    Start Voting
                                </button>
                            </div>

                            <div className='w-full h-screen grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3  grid-cols-2 gap-6 items-center justify-center lg:p-5'>
                                {
                                    movies.map((movie) => (
                                        <div key={movie.id} className='relative rounded-xl  gap-3 h-48 min-w-36 md:h-60 md:w-44 lg:h-72 lg:min-w-56 overflow-hidden hover:scale-105 mt-4' onClick={() => setSelectedMovie(movie)}>
                                            <img
                                                src={
                                                    movie.poster_path
                                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                        : no_image

                                                }
                                                alt={movie.original_title} className='object-fill h-full w-full'>
                                            </img>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
            }

            {selectedMovie && (
                <Modal
                    movie={selectedMovie}
                    isClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    )
}

export default SeeAllPage