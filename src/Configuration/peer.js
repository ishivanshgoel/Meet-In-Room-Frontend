import Peer from 'peerjs'
/**
 * 
 * Return an instance to peer connection
 * 
 * @param {*} id unique id to identify user
 * @returns an instance of peer server connection 
 */

let peer
function initPeer(id){
    peer = new Peer(id, {
    })
}

export {  peer, initPeer }