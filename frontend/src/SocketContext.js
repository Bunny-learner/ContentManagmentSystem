import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000", { autoConnect: false });

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
      setSocketId(socket.id);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, socketId }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
