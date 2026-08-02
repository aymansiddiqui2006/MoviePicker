import { useState } from "react";
import RoomContext from "./RoomContext";

const RoomContextProvider = ({ children }) => {

    const [roomCode, setroomCode] = useState(() => {
        const code = localStorage.getItem("roomCode") || "";
        return code;
    });

    const [nickname, setnickname] = useState(() => {
        const code = localStorage.getItem("nickname") || "";
        return code;
    });

    return (
        <RoomContext.Provider value={{ roomCode, setroomCode, nickname, setnickname}} >
            {children}
        </RoomContext.Provider>
    )
}

export default RoomContextProvider;