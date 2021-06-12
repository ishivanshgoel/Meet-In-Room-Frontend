import socket from '../socket'

/**
 * @package make user status online
 * @param online 
 */

function online(userId){
    socket.emit('join', userId)
}

export default online

