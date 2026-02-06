import io from 'socket.io-client';

// Construct socket URL dynamically to support network access
const socketUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:5000';

export const socket = io(socketUrl, {
    transports: ['websocket', 'polling'], // Add this to ensure better compatibility
    withCredentials: false
});
