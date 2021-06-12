import socket from "../socket"

/**
 * @package recieve call offer
 * @param {id} sender's id  
 */

function reciever(){

    socket.on("receive-call-offer", (data)=>{
        console.log("Recieved Call ", data)
        let answer = window.confirm(`Recieving call from ${data.sender}`)
        
        // call accepted
        if(answer){
            socket.emit("accepted-call-offer", data)
        } else{
            socket.emit("rejected-call-offer", 'Decline')
        }
    })


    socket.on("call-offer-accepted", (data)=>{
        alert("Call offer accepted")
    })

    socket.on("call-offer-rejected", (data)=>{
        alert("Call Offer Rejected")
    })

}

export default reciever