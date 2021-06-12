import socket from "../socket"

/**
 * @package recieve call offer
 * @param {id} sender's id  
 */

function call(id){
    console.log('Place Call')
    socket.emit("place-call", 'place call to id: '+id)

}

export default call