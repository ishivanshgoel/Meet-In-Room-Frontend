// socket instance
import socketIOClient from "socket.io-client"
import SERVER from "../../Configuration/baseurl"
const socket = socketIOClient(SERVER)

export default socket