import React, { useState, useContext } from 'react'
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import socket from "../utils/socket.js";

import RoomContext from "../context/RoomContext.jsx"

import { FaArrowCircleRight } from "react-icons/fa";

import api from '../utils/apiInstance.js';
import { ApiPaths } from '../utils/apiPaths.js';

function CreateRoom() {

    const navigate = useNavigate();
    const { setroomCode, setnickname, setIsHost } = useContext(RoomContext)

    const [roomName, setRoomName] = useState("");
    const [nickname, setNickename] = useState("");

    const [roomCode, setRoomCode] = useState("");

    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        console.log("clicked on create")

        if (!roomName.trim() || !nickname.trim()) {
            return toast.error("Please fill all fields");
        }
        setLoading(true);

        try {
            const data = {
                roomName: roomName,
                nickname: nickname
            }

            const res = await api.post(ApiPaths.ROOM.CREATE_ROOM, data);

            const createRoomCode = res.data.data.roomCode

            setRoomCode(createRoomCode);

            toast.success("Room Created");

            setRoomName("");
            setNickename("");

            localStorage.setItem("roomCode", createRoomCode);
            localStorage.setItem("nickname", nickname);

            setroomCode(createRoomCode);
            setnickname(nickname);
            setRoomName(roomName);

            setIsHost(true);

            socket.emit("join-room", createRoomCode);


        } catch (error) {
            toast.error(
                error?.response?.data?.message || error.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }

    }


    return (
        <>
            {
                (!roomCode) ?

                    <div className='flex flex-col gap-4'>



                        <div className="roomName flex flex-col gap-0.5 ">
                            <h3 className='font-semibold text-lg'>Room name:</h3>
                            <input type="text"
                                value={roomName}
                                placeholder='movie night etc..'
                                onChange={(e) => setRoomName(e.target.value)}
                                className='bg-white/55 py-1.5 px-2.5 rounded-lg font-semibold' />
                        </div>

                        <div className="roomName flex flex-col gap-0.5 ">
                            <h3 className='font-semibold text-lg'>Nickename:</h3>
                            <input type="text"
                                value={nickname}
                                placeholder='ben ect..'
                                onChange={(e) => setNickename(e.target.value)}
                                className='bg-white/55 py-1.5 px-2.5 rounded-lg font-semibold' />
                        </div>

                        <button
                            type="button"
                            disabled={loading}
                            className={`p-2 px-5 rounded-xl text-lg font-semibold transition cursor-pointer ${loading
                                ? "bg-yellow-300 cursor-not-allowed"
                                : "bg-amber-400 hover:bg-yellow-500"
                                }`}
                            onClick={handleCreateRoom}
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>

                    </div>

                    :
                    <div className='flex flex-col gap-5 items-center'>
                        <h1 className='w-48 flex justify-center bg-gray-300 py-2 rounded-xl text-lg font-semibold '  >
                            {roomCode}
                        </h1>

                        <div className='flex justify-center items-center gap-3'>
                            <button type="button" className='bg-amber-400 py-1 px-5 rounded-xl text-lg font-semibold hover:bg-yellow-500 cursor-pointer'

                                onClick={() => {
                                    const shareText = ` You're invited to a Movie Picker room: ${roomName}!
                                    
                                    Join the room and vote together to decide what to watch.
                                    
                                    🔑 Room Code: ${roomCode}
                                    🌐 Join here:https://movie-picker-wheat.vercel.app/
                                    
                                    Enter the room code after opening the app. `;

                                    navigator.clipboard.writeText(shareText);
                                    toast.success("Invitation copied!");
                                }}
                            >Copy
                            </button>
                            <button type='button' className='cursor-pointer hover:transition hover:scale-90 duration-200' onClick={() => navigate("/room")}>
                                <FaArrowCircleRight className='text-white w-8 h-8' />
                            </button>
                        </div>

                    </div>


            }</>


    )
}

export default CreateRoom