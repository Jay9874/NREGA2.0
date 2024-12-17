import { io } from 'socket.io-client';
const NODE_ENV = import.meta.env.MODE
// "undefined" means the URL will be computed from the `window.location` object
const URL = NODE_ENV === 'production' ? 'https://nrega-2-0.vercel.app' : 'http://localhost:8080';

export const socket = io(URL);