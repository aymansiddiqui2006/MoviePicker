
export const ApiPaths={
   ROOM:{
    CREATE_ROOM:"/room/create",
    JOIN_ROOM:"/room/join",
    VOTING_STARTED:(roomCode,nickname)=>`/room/${roomCode}/${nickname}/vote`,
    WINNING_COUNT_STARTED:(roomCode,nickname)=>`/room/${roomCode}/${nickname}/end-voting`,
    PARTICIPANT_READY_TO_VOTE:(roomCode,nickname)=>`/room/${roomCode}/${nickname}/start-voting`,
    READY_TO_ADD_MOVIE:(roomCode,nickname)=>`/room/${roomCode}/${nickname}`,
    GET_ROOM:(roomCode)=>`/room/${roomCode}`,
   },
   MOVIE:{
     ADD_MOVIE:(roomCode,nickname)=>`/movie/${roomCode}/${nickname}/add`,
     VOTE_MOVIE:(roomCode,tmdbId,nickname)=>`/movie/${roomCode}/${tmdbId}/${nickname}`,
     GET_MOVIES:(roomCode)=>`/movie/${roomCode}/movies`,
     WINNING_MOVIE:(roomCode)=>`/movie/${roomCode}`,
   }
}