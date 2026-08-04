import React, { useContext } from 'react'
import { RxCross2 } from "react-icons/rx";
import { IoMdAddCircleOutline } from "react-icons/io";
import api from "../utils/apiInstance"
import { ApiPaths } from "../utils/apiPaths"
import RoomContext from '../context/RoomContext';

import no_image from "../assets/no_image.png"

import toast from 'react-hot-toast';


function Modal({ isClose, movie }) {

    const { nickname, roomCode } = useContext(RoomContext)

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            const data = {
                tmdbId: movie.id,
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                title: movie.original_title
            }
            const res = await api.post(ApiPaths.MOVIE.ADD_MOVIE(roomCode, nickname), data);
            toast.success("movie Added")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            isClose()
        }
    }


    if (!movie) return null;
    return (
        <div className='w-full inset-0 h-screen fixed flex justify-center items-center bg-black/80 px-5'>
            <div className='bg-gray-900 relative rounded-2xl flex flex-col shadow-black shadow-lg lg:w-2xl overflow-hidden'>
                <div className='h-fit w-full'>
                    <img
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                                : no_image
                        }
                        alt={movie.original_title} className='object-cover h-full w-full lg:h-72' >
                    </img>
                    <div className='hover:bg-gray-700/50 top-4 right-4 lg:top-5 lg:right-5 absolute hover:rounded-3xl p-1' onClick={isClose}>
                        <RxCross2 className='text-white font-extrabold text-2xl lg:text-3xl' />
                    </div>

                </div>
                <div className='flex flex-col p-2 gap-2 lg:gap-3.5 '>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-white font-medium text-lg lg:text-xl'>{movie.original_title}</h1>
                        <button className='flex items-center justify-center text-white bg-amber-400 font-semibold rounded-lg p-1 cursor-pointer hover:bg-amber-500' onClick={handleAddMovie}>
                            select {" "} <IoMdAddCircleOutline className='text-2xl font-bold' />
                        </button>
                    </div>
                    <div className='text-white flex gap-2 '>
                        <div className='bg-gray-600 p-0.5 px-1 rounded-lg'>{movie.release_date?.slice(0, 4)}</div>
                        <div className='bg-gray-600 p-0.5 px-1 rounded-lg'>{movie.vote_average.toFixed(1)}</div>
                    </div>
                    <h2 className='text-white text-sm mt-2.5'>{movie.overview}</h2>
                </div>

            </div>
        </div>
    )
}

export default Modal