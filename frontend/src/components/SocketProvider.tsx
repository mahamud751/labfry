"use client";

import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import socketService from "../services/socketService";

interface SocketProviderProps {
  children: React.ReactNode;
}

export default function SocketProvider({ children }: SocketProviderProps) {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { isConnected } = useAppSelector((state) => state.socket);

  useEffect(() => {
    // Connect socket when component mounts
    if (!socketService.isConnected()) {
      console.log("🔌 SocketProvider: Connecting socket");
      socketService.connect();
    }

    return () => {
      // Clean up on unmount
      console.log("🔌 SocketProvider: Unmounting, disconnecting socket");
      socketService.disconnect();
    };
  }, []); // Remove isConnected dependency to prevent reconnections

  useEffect(() => {
    // Authenticate socket when user logs in
    if (isAuthenticated && token && socketService.isConnected()) {
      socketService.authenticate(token);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    // Disconnect socket when user logs out
    if (!isAuthenticated && socketService.isConnected()) {
      socketService.disconnect();
    }
  }, [isAuthenticated]);

  return <>{children}</>;
}
