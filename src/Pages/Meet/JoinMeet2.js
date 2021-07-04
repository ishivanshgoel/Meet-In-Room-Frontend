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
import RecordRTC, { invokeSaveAsDialog, CanvasRecorder } from 'recordrtc'
import Button from '@material-ui/core/Button'
import Mic from '@material-ui/icons/Mic'
import MicOff from '@material-ui/icons/MicOff'
import CallEnd from '@material-ui/icons/CallEnd'
import Videocam from '@material-ui/icons/Videocam'
import VideocamOff from '@material-ui/icons/VideocamOff'
import Message from '@material-ui/icons/Message'
import Settings from '@material-ui/icons/Settings'
import People from '@material-ui/icons/People'
import Send from '@material-ui/icons/Send'
import Avatar from 'react-avatar'
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import './CSS/meet2.css'
import './JS/joinmeet2.js'
import { add, less } from './JS/joinmeet2'

// components
import Notification from '../../Components/Notification/Notification'


let myStreamGlobal // global stream of user
let connectedUsers = {} // map of connected peers

function JoinMeet2() {

    const user = useSelector((state) => state.user)
    const email = useSelector((state) => state.email)
    const messages = useSelector((state) => state.messages)
    const meetingParticipants = useSelector((state) => state.meetingParticipants)
    const dispatch = useDispatch()
    const handle = useFullScreenHandle();

    // mic and video status
    const [micStatus, setMicStatus] = useState(true)
    const [videoStatus, setVideoStatus] = useState(true)
    const [screenShare, setScreenShare] = useState(false)

    const [sideComponent, setSideComponent] = useState('participants')
    const myVideo = useRef() // reference to local video
    const recorderRef = useRef(null) // video recording
    const { id } = useParams(); // meeting room id


    // camera constraints
    function setConstraints() {
        const constraints = {
            // 'audio': {
            //     'echoCancellation': true,
            // },
            'audio': true,
            'video': true
        }
        return constraints
    }

    // Open camera with at least minWidth and minHeight capabilities
    async function openStream() {
        let cons = setConstraints()
        return await navigator.mediaDevices.getUserMedia(cons);
    }

    useEffect(async () => {

        handle.enter()

        // join the meeting room
        socket.emit('join-room', { roomId: id, userId: user, userEmail: email })

        // event fired when any of the user in the room gets disconnected
        socket.on('user-disconnected', ({ userId, userEmail }) => {
            console.log("")
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
            if (!connectedUsers[userId]) {
                connectPeers(userId, userEmail)
            }
        })

        // get stream
        myStreamGlobal = await openStream()
        console.log("My Global Stream after useEffect ", myStreamGlobal)

        // add yourself in participants list
        dispatch({
            type: MEETINGPARTICIPANTS,
            newParticipant: email
        })

        console.log("After Add yourself ", meetingParticipants)

        // set to local element
        myVideo.current.srcObject = myStreamGlobal
        console.log("My Global Stream after setting local video ", myStreamGlobal)


        // listen for incoming calls
        peer.on('call', call => {

            // metadata from call
            let metadata = call.metadata
            let userId = metadata.userId
            let userEmail = metadata.userEmail

            // send you stream
            call.answer(myStreamGlobal)

            // append user stream to grid
            call.on('stream', (stream) => {
                // add in the participants list
                dispatch({
                    type: MEETINGPARTICIPANTS,
                    newParticipant: userEmail
                })
                if (!connectedUsers[userId]) {
                    add(stream, userId, userEmail)
                    connectedUsers[userId] = true
                }
            })
        })
    }, [])

    // when someone joins our room, call them using their peer id
    function connectPeers(userId, userEmail) {
        // send userId in metadata of call
        let options = { metadata: { "type": "video-call", "userId": user, "userEmail": email } }
        const call = peer.call(userId, myStreamGlobal, options)

        call.on('stream', userVideoStream => {
            Notification("New User Connected", `${userEmail} Joined`, 'success')
            dispatch({
                type: MEETINGPARTICIPANTS,
                newParticipant: userEmail
            })
            if (!connectedUsers[userId]) {
                connectedUsers[userId] = true
                add(userVideoStream, userId, userEmail)
            }
        }
        )

        // close video
        call.on('close', () => {
            connectedUsers[userId] && less(userId)
            dispatch({
                type: REMOVEPARTICIPANT,
                removeParticipant: userEmail
            })
            connectedUsers[userId] = false
            Notification('User Left', `${userEmail} left the meeting`, 'warning')
        })
    }

    const handleSendMessage = () => {
        setSideComponent('chat')
        const message = window.prompt('Enter Message ')
        if (message) {
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
        handle.enter()
    }

    const handleControls = () => {

    }

    const handleMute = () => {
        if (myStreamGlobal && myStreamGlobal.getAudioTracks()) {
            myStreamGlobal.getAudioTracks()[0].enabled = !(myStreamGlobal.getAudioTracks()[0].enabled)
            setMicStatus(!micStatus)
        } else alert('Cannot Perform Action')
    }

    const handleVideo = async () => {
        if (myStreamGlobal && myStreamGlobal.getVideoTracks()) {
            myStreamGlobal.getVideoTracks()[0].enabled = !(myStreamGlobal.getVideoTracks()[0].enabled)
            setVideoStatus(!videoStatus)
        } else {
            alert('Cannot Perform Action')
        }
    }

    const handleLeaveMeet = () => {
        window.location.href = "/team"
    }

    async function captureScreen(){
        let captureStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              cursor: "always"
            },
            audio: false
          });
        return captureStream
    }

    const handleRecord = async () => {
        let videoGrid = document.getElementById('Dish')
        console.log(videoGrid)
        let recorder = new CanvasRecorder(videoGrid, { disableLogs: false, useWhammyRecorder: true });
        recorder.record();
        // recorderRef.current = RecordRTC(await captureScreen(), {
        //     type: 'video',
        // });
        // recorderRef.current.startRecording();
        const sleep = m => new Promise(r => setTimeout(r, m));
        await sleep(7000);

        recorder.stop((blob) => {
            // let blob = recorderRef.current.getBlob();
            // video.src = URL.createObjectURL(blob);
            invokeSaveAsDialog(blob, 'test.webm');
        });
        
    
    }

    return (
        <>
            <div className="row" style={{ backgroundColor: "black" }}>
                <div className="col-10">
                    <div className="controls-left">
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="primary" onClick={handleMute}>
                                {
                                    micStatus ? <Mic /> : <MicOff />
                                }
                            </Button>
                        </div>
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="primary" onClick={handleVideo}>
                                {
                                    videoStatus ? <Videocam /> : <VideocamOff />
                                }
                            </Button>
                        </div>
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="primary" onClick={() => setSideComponent("controls")}>
                                <Settings />
                            </Button>
                        </div>
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="secondary" onClick={handleLeaveMeet}>
                                <CallEnd />
                            </Button>
                        </div>
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="primary" onClick={() => setSideComponent("chat")}>
                                <Message />
                            </Button>
                        </div>
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                                <Send />
                            </Button>
                        </div>
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="primary" onClick={() => setSideComponent("participants")}>
                                <People />
                            </Button>
                        </div>
                        <div style={{ margin: "2px" }}>
                            <Button variant="contained" color="primary" onClick={handleRecord}>
                                <People />
                            </Button>
                        </div>
                    </div>

                    {/* video grid */}
                    <div id="Dish">
                        <video ref={myVideo} autoPlay className="Camera" muted="muted"></video>
                    </div>
                </div>
                <div className="col-2 meet-sidebar">
                    <div className="meet-righ">
                        {
                            sideComponent == 'participants' ? (
                                <>

                                    <div className="meet-right-header">
                                        <h3><People /> Participants</h3>
                                    </div>
                                    <div className="meet-right-window">
                                        {
                                            meetingParticipants && meetingParticipants.map((participant) => (
                                                <p style={{ color: 'white' }}><Avatar name={participant} size="30" textSizeRatio={0.75} round="20px" style={{ margin: "10px" }} /> {participant}</p>
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
                                        <h3><Message /> Chat</h3>
                                    </div>
                                    <div className="meet-right-window">
                                        {
                                            messages && messages.map(({ from, message }, index) =>
                                                from === email ? (
                                                    <div id={`${from}-${index}`} className="meet-message">
                                                        <p><b>You</b></p>
                                                        <p>{message}</p>
                                                    </div>
                                                ) : (
                                                    <div id={`${from}-${index}`} className="meet-message">
                                                        <p><b>{from}</b></p>
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
                                        <span><h3>Controls</h3></span>
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
