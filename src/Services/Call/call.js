import socket from "../socket"

/**
 * @package make call offer
 * @param {rid} reciever id to place the call offer 
 * @param {sid} sender's id
 */

function call(rid, sid){
    console.log('Place Call')
    socket.emit("place-call", 'place call to id: '+rid)

}

export default call