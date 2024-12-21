import { io } from 'socket.io-client'
const NODE_ENV = import.meta.env.MODE
// "undefined" means the URL will be computed from the `window.location` object
const url = NODE_ENV === 'production' ? '' : 'http://localhost:8080'

const socket = io(url, {
  withCredentials: true
})

export {socket}
