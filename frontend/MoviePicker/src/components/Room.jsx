import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/apiInstance'
import { ApiPaths } from '../utils/apiPaths'
import toast from 'react-hot-toast'

import { useContext } from 'react'
import RoomContext from '../context/RoomContext'

import { IoCheckbox } from "react-icons/io5";

function Room() {

    const navigate = useNavigate();

    const [roomName, setRoomName] = useState("");
    const [members, setMembers] = useState([]);
    const [host, setHost] = useState("");
    const [roomStatus, setRoomStatus] = useState("waiting")
    const [personStatus, setPersonStatus] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);


    const { roomCode, nickname, setIsHost, isHost } = useContext(RoomContext)

    const fetchRoom = async () => {
        try {
            const res = await api.get(ApiPaths.ROOM.GET_ROOM(roomCode));

            setRoomName(res?.data?.data?.roomName);
            setMembers(res?.data?.data?.members);
            setHost(res?.data?.data?.host);
            setRoomStatus(res?.data?.data?.status)

            const myData = res.data.data.members.find(
                member => member.nickname === nickname
            );

            setPersonStatus(myData?.readyToVote ?? false);
            setHasVoted(myData?.hasVoted ?? false);


            setIsHost(res.data.data.host.nickname === nickname);

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }

    useEffect(() => {
        if (!roomCode) return;

        fetchRoom();

        const interval = setInterval(fetchRoom, 2000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (roomStatus === "adding_movies") {
            if (personStatus) {
                navigate("/room");
            }
            else {
                navigate("/movie")
            }

        }

        if (roomStatus === "voting") {
            if (!hasVoted) {
                navigate("/vote");
            }
        }

    }, [roomStatus, personStatus, hasVoted, navigate]);



    const handleChangeStatus = async (e) => {
        e.preventDefault();

        try {
            const res = await api.patch(ApiPaths.ROOM.READY_TO_ADD_MOVIE(roomCode, nickname))
            toast.success("ready to add movie")


            fetchRoom();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    const handleChangeStatusToVote = async (e) => {
        e.preventDefault();

        try {
            const res = await api.patch(ApiPaths.ROOM.VOTING_STARTED(roomCode, nickname))
            toast.success("ready to vote movie")

            setPersonStatus(true);
            fetchRoom();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    const handleStartCount = async () => {
    try {
      const res = await api.patch(ApiPaths.ROOM.WINNING_COUNT_STARTED(roomCode, nickname));
      setRoomStatus(res.data.data.status);
      toast.success("Counting Started");
      navigate("/result")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  }

    if (roomStatus === "adding_movies") {
        return (
            <div className='text-white flex flex-col items-center mt-5'>
                <div className="header flex flex-col gap-3">
                    <h1 className='text-yellow-400 text-5xl font-bold'>{roomName}</h1>
                    <p className='font-semibold'>Created by : {host.nickname}</p>

                    {!isHost && (
                        <p className="text-gray-300 mt-6">
                            Waiting for the host to start voting...
                        </p>
                    )}
                </div>

                <div className="w-full px-6 lg:px-24 mt-14 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-32 gap-y-6">
                    {members.map((member) => (
                        <div
                            key={member._id}
                            className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 flex items-center justify-between"
                        >

                            <div className='flex gap-1.5'>
                                <span className="font-semibold text-white">
                                    {member.nickname}
                                </span>

                                {
                                    member.nickname === nickname &&
                                    <span>
                                        (me)
                                    </span>
                                }
                                {
                                    host?._id === member._id && (
                                        <span className="text-green-400 text-md font-medium">(Host)</span>
                                    )
                                }
                            </div>



                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-200">
                                    Ready to Vote
                                </span>

                                {member.readyToVote ? (
                                    <IoCheckbox className="text-green-500 text-2xl" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                                )}
                                <div>{"("}{member.moviesSelected.length}/2{")"}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="button mt-6 mb-6 flex gap-8">
                    {
                        isHost && (
                            <button
                                className='bg-yellow-500 p-2.5 px-4 rounded-2xl text-lg font-semibold cursor-pointer hover:bg-yellow-600 hover:scale-95 shadow-md shadow-gray-500'
                                onClick={handleChangeStatusToVote}
                            >start Voting</button>
                        )
                    }
                </div>



            </div>
        )
    }

    if (roomStatus === "voting") {
        return (
            <div className='text-white flex flex-col items-center mt-5'>
                <div className="header flex flex-col gap-3">
                    <h1 className='text-yellow-400 text-5xl font-bold'>{roomName}</h1>
                    <p className='font-semibold'>Created by : {host.nickname}</p>

                    {!isHost && (
                        <p className="text-gray-300 mt-6">
                            Waiting for the host to start counting vote...
                        </p>
                    )}
                </div>

                <div className="w-full px-6 lg:px-24 mt-14 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-32 gap-y-6">
                    {members.map((member) => (
                        <div
                            key={member._id}
                            className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 flex items-center justify-between"
                        >

                            <div className='flex gap-1.5'>
                                <span className="font-semibold text-white">
                                    {member.nickname}
                                </span>

                                {
                                    member.nickname === nickname &&
                                    <span>
                                        (me)
                                    </span>
                                }
                                {
                                    host?._id === member._id && (
                                        <span className="text-green-400 text-md font-medium">(Host)</span>
                                    )
                                }
                            </div>



                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-200">
                                    Has voted
                                </span>

                                {member.hasVoted ? (
                                    <IoCheckbox className="text-green-500 text-2xl" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="button mt-6 mb-6 flex gap-8">
                    {
                        isHost && (
                            <button
                                className='bg-yellow-500 p-2.5 px-4 rounded-2xl text-lg font-semibold cursor-pointer hover:bg-yellow-600 hover:scale-95 shadow-md shadow-gray-500'
                                onClick={handleStartCount}
                            >start counting</button>
                        )
                    }
                </div>



            </div>
        )
    }

    return (
        <div className='text-white flex flex-col items-center mt-5'>
            <div className="header flex flex-col gap-3">
                <h1 className='text-yellow-400 text-5xl font-bold'>{roomName}</h1>
                <p className='font-semibold'>Created by : {host.nickname}</p>

                <h2 className='text-2xl font-semibold flex items-center justify-center mt-5'>
                    {
                        roomStatus === "adding_movies" ? "Ready" : "Waiting for everyone..."
                    }
                </h2>
            </div>

            <div className="w-full px-6 lg:px-24 mt-14 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-x-32 gap-y-6">
                {members.map((member) => (
                    <div
                        key={member._id}
                        className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 flex items-center justify-between"
                    >

                        <div className='flex gap-1.5'>
                            <span className="font-semibold text-white">
                                {member.nickname}
                            </span>

                            {
                                member.nickname === nickname &&
                                <span>
                                    (me)
                                </span>
                            }
                            {
                                host?._id === member._id && (
                                    <span className="text-green-400 text-md font-medium">(Host)</span>
                                )
                            }
                        </div>



                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-200">
                                Ready
                            </span>

                            {member.ready ? (
                                <IoCheckbox className="text-green-500 text-2xl" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                            )}


                        </div>
                    </div>
                ))}
            </div>

            <div className="button mt-6 mb-6">
                <button
                    className='bg-yellow-500 p-2.5 px-4 rounded-2xl text-lg font-semibold cursor-pointer hover:bg-yellow-600 hover:scale-95 shadow-md shadow-gray-500'
                    onClick={handleChangeStatus}
                >Ready</button>
            </div>

        </div>
    )
}

export default Room