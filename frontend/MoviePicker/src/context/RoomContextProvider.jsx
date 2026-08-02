import { useState } from "react";
import RoomContext from "./RoomContext";

const RoomContextProvider = ({ children }) => {

    const [roomCode, setRoomCode] = useState(() => {
        const code = localStorage.getItem("roomCode");
        return code ? JSON.parse(code) : null;
    });

    return (
        <RoomContext.Provider value={{roomCode, setRoomCode}} >
            {children}
        </RoomContext.Provider>
    )
}

export default RoomContextProvider;