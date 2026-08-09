import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';

import api from '../utils/apiInstance.js';
import { ApiPaths } from '../utils/apiPaths.js';
import toast from 'react-hot-toast';

import RoomContext from "../context/RoomContext.jsx"
import socket from '../utils/socket.js';


function JoinRoom() {

  const navigate = useNavigate();
  const { setroomCode, setnickname, setroomname } = useContext(RoomContext)

  const [nickname, setNickename] = useState("");
  const [roomCode, setRoomCode] = useState("");


  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!roomCode.trim() || !nickname.trim()) {
      return toast.error("Please fill all fields");
    }
    setLoading(true);

    try {

      const data = {
        roomCode,
        nickname
      }

      const res = await api.post(ApiPaths.ROOM.JOIN_ROOM, data);

      toast.success("Room joined!")


      setNickename("");
      setRoomCode("")

      localStorage.setItem("roomCode", roomCode);
      localStorage.setItem("nickname", nickname);

      setroomCode(roomCode);
      setnickname(nickname);

      socket.emit("join-room", roomCode);

      navigate("/room")

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col gap-4'>



      <div className="roomName flex flex-col gap-0.5 ">
        <h3 className='font-semibold text-lg'>Room Code:</h3>
        <input type="text"
          value={roomCode}
          placeholder='movie night etc..'
          onChange={(e) => setRoomCode(e.target.value)}
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
        onClick={handleLogin}
      >
        {
          loading ? "joining.." : "join"
        }
      </button>

    </div>
  )
}



export default JoinRoom