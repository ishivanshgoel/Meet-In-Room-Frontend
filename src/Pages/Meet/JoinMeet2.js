import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import socket from '../../Configuration/socket'
import { peer } from '../../Configuration/peer'
import {
    MEETINGPARTICIPANTS,
    REMOVEPARTICIPANT,
    SETMESSAGE
} from '../../Reducers/actionTypes'


import './CSS/meet2.css'
import './JS/joinmeet2.js'
import { add, less } from './JS/joinmeet2'

// components
import Notification from '../../Components/Notification/Notification'

function JoinMeet2() {

    const user = useSelector((state) => state.user)
    const email = useSelector((state) => state.email)
    const messages = useSelector((state) => state.messages)
    const meetingParticipants = useSelector((state) => state.meetingParticipants)
    const dispatch = useDispatch()

    const [sideComponent, setSideComponent] = useState('chat')
    const myVideo = useRef() // reference to local video
    const { id } = useParams(); // meeting room id
    let connectedUsers = {} // map of connected peers
    let participantList = []

    // camera constraints
    function setConstraints() {
        const constraints = {
            // 'audio': {
            //     'echoCancellation': true,
            // },
            'audio': false,
            'video': true
        }
        return constraints
    }

    // Open camera with at least minWidth and minHeight capabilities
    async function openStream() {
        let cons = setConstraints()
        return await navigator.mediaDevices.getUserMedia(cons);
    }

    let myGlobalStream


    useEffect(async () => {

        // join the meeting room
        socket.emit('join-room', { roomId: id, userId: user, userEmail: email })

        // event fired when any of the user in the room gets disconnected
        socket.on('user-disconnected', ({ userId, userEmail }) => {
            connectedUsers[userId] && less(userId)
            connectedUsers[userId] = false
            dispatch({
                type: REMOVEPARTICIPANT,
                removeParticipant: userEmail
            })
            Notification('User Left', `${userEmail} left the meeting`, 'warning')
        });

        // new message
        socket.on('new-message', ({ from, message }) => {
            // Notification('New Message','', 'success')
            let newMessage = { from, message }
            dispatch({
                type: SETMESSAGE,
                newMessage: newMessage
            })
            console.log("Messages after receiving ", messages)
        })

        // when someone connects to our room
        socket.on('new-user-connect', ({ userId, userEmail }) => {
            console.log('New User Connected to Our Room ', userEmail)
            connectPeers(userId, userEmail)
        })

        // get stream
        myGlobalStream = await openStream()

        // add yourself in participants list
        dispatch({
            type: MEETINGPARTICIPANTS,
            newParticipant: email
        })

        console.log("After Add yourself ", meetingParticipants)
        // }

        // set to local element
        myVideo.current.srcObject = myGlobalStream

        // listen for incoming calls
        peer.on('call', call => {

            // metadata from call
            let metadata = call.metadata

            // send you stream
            call.answer(myGlobalStream)

            let userId = metadata.userId
            let userEmail = metadata.userEmail

            // append user stream to grid
            call.on('stream', (stream) => {
                connectedUsers[userId] = true
                // add in the participants list
                dispatch({
                    type: MEETINGPARTICIPANTS,
                    newParticipant: userEmail
                })
                add(stream, userId, userEmail)
            })
        })

    }, [])

    // when someone joins our room, call them using their peer id
    function connectPeers(userId, userEmail) {

        // send userId in metadata of call
        let options = { metadata: { "type": "video-call", "userId": user, "userEmail": email } }
        const call = peer.call(userId, myGlobalStream, options)

        call.on('stream', userVideoStream => {
            connectedUsers[userId] = true
            Notification("New User Connected", `${userEmail} Joined`, 'success')
            dispatch({
                type: MEETINGPARTICIPANTS,
                newParticipant: userEmail
            })
            add(userVideoStream, userId, userEmail)
        }
        )

        // close video
        call.on('close', () => {
            less(userId)
            dispatch({
                type: REMOVEPARTICIPANT,
                removeParticipant: userEmail
            })
            Notification('User Left', `${userEmail} left the meeting`, 'warning')
        })
    }

    const handleSendMessage = () => {
        console.log('Handle Send Message')
        const message = window.prompt('Enter Message ')
        let newMessage = {
            message,
            from: email
        }
        dispatch({
            type: SETMESSAGE,
            newMessage: newMessage
        })
        socket.emit('send-message', newMessage)
    }

    return (
        <>
            <div className="row">
                <div className="col-10">
                    <div id="Dish">
                        <video ref={myVideo} autoPlay className="Camera" muted="muted"></video>

                    </div>
                </div>
                <div className="col-2 meet-sidebar">
                    <div className="meet-right">
                        {
                            sideComponent == 'participants' ? (
                                <>

                                    <div className="meet-right-header">
                                        <h6>Participants</h6>
                                        <button onClick={handleSendMessage}>New Message</button>
                                    </div>
                                    <div className="meet-right-window">
                                        {
                                            meetingParticipants && meetingParticipants.map((participant) => (
                                                <p style={{ color: 'white' }}>{participant}</p>
                                            ))
                                        }
                                    </div>

                                </>
                            ) : (null)
                        }
                        {
                            sideComponent == "chat" && (
                                <>
                                    <div className="meet-header">
                                        <h6>Chat</h6>
                                        <button onClick={handleSendMessage}>New Message</button>
                                    </div>
                                    <div className="meet-right-window">
                                        {
                                            messages && messages.map(({ from, message }, index) =>
                                                from === email ? (
                                                    <div id={`${from}-${index}`} className="myMessage">
                                                        <p>You</p>
                                                        <p>{message}</p>
                                                    </div>
                                                ) : (
                                                    <div id={`${from}-${index}`} className="peerMessage">
                                                        <p>{from}</p>
                                                        <p>{message}</p>
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>
                                </>

                            )
                        }
                        {
                            sideComponent == "controls" && (
                                <>
                                <div className="meet-header">
                                    <h6>Controls</h6>
                                    <button onClick={handleSendMessage}>New Message</button>
                                </div>
                                <div className="meet-right-window">

                                </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default JoinMeet2
