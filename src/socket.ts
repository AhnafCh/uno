/// <reference types="vite/client" />
import { io } from "socket.io-client";

// Get URL from env or use relative path for production
const URL = import.meta.env.VITE_APP_URL || "";

export const socket = io(URL, {
  autoConnect: false
});
