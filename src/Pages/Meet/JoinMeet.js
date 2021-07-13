import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import socket from '../../Configuration/socket'
import { peer } from '../../Configuration/peer'
import {
    MEETINGPARTICIPANTS,
    REMOVEPARTICIPANT,
    SETMESSAGE,
    SETMESSAGES
} from '../../Reducers/actionTypes'
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc'
import Button from '@material-ui/core/Button'
import Mic from '@material-ui/icons/Mic'
import MicOff from '@material-ui/icons/MicOff'
import CallEnd from '@material-ui/icons/CallEnd'
import Videocam from '@material-ui/icons/Videocam'
import VideocamOff from '@material-ui/icons/VideocamOff'
import Message from '@material-ui/icons/Message'
import People from '@material-ui/icons/People'
import Send from '@material-ui/icons/Send'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import FiberSmartRecordIcon from '@material-ui/icons/FiberSmartRecord'
import Avatar from 'react-avatar'

import './CSS/meet2.css'
import './JS/joinmeet.js'
import { add, less } from './JS/joinmeet.js'

import post from '../../Helpers/Request/post'

// components
import Notification from '../../Components/Notification/Notification'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'

/**
 * @param {object} myStreamGlobal local stream of user
 * @param {object} connectedUsers map of connected users
 * @param {object} record screen stream capture from meet recording
 * @param {function} connectPeers calls peers
 * @param {function} handleSendMessage send message to all the peers in team
 * @param {function} handleMute mute audio of current user
 * @param {function} handleVideo turn off video of current user
 * @param {function} handleLeaveMeet to leave the meeting
 * @param {function} handleRecord record the meeting
 */

let myStreamGlobal // global stream of user
let connectedUsers = {} // map of connected peers
let recorder // for screen recording

function JoinMeet() {

    const user = useSelector((state) => state.user)
    const email = useSelector((state) => state.email)
    const messages = useSelector((state) => state.messages)
    const [loadingScreen, setLoadingScreen, hideLoadingScreen] = LoadingScreen()
    const meetingParticipants = useSelector((state) => state.meetingParticipants)
    const dispatch = useDispatch()

    // mic and video status
    const [micStatus, setMicStatus] = useState(false)
    const [videoStatus, setVideoStatus] = useState(true)
    const [meetRecord, setMeetRecord] = useState(false)

    const [sideComponent, setSideComponent] = useState('participants')
    const myVideo = useRef() // reference to local video
    const { id } = useParams(); // meeting room id


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

    useEffect(async () => {

        setLoadingScreen()

        connectedUsers[user] = true
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
            let newMessage = { from, message }
            dispatch({
                type: SETMESSAGE,
                newMessage: newMessage
            })
        })

        // when someone connects to our room
        socket.on('new-user-connect', ({ userId, userEmail }) => {
                connectPeers(userId, userEmail)
        })

        // get stream
        myStreamGlobal = await openStream()

        // add yourself in participants list
        dispatch({
            type: MEETINGPARTICIPANTS,
            newParticipant: email
        })

        // set to local element
        myVideo.current.srcObject = myStreamGlobal

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

        // fetch all room messages
        const response = await post('allMessages', {
            roomId: id,
        })

        if (response.data) {
            // set messages in store
            dispatch({
                type: SETMESSAGES,
                allMessages: response.data
            })
        } else {
            Notification('Error', 'Cannot fetch chat', 'warning')
        }

        hideLoadingScreen()

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

    const handleSendMessage = async () => {
        setSideComponent('chat')
        const message = window.prompt('Enter Message ')
        if (message) {
            let newMessage = {
                message,
                from: email
            }
            const response = await post('sendMessage', {
                roomId: id,
                from: email,
                message: message
            })

            if (response.data) {
                dispatch({
                    type: SETMESSAGE,
                    newMessage: newMessage
                })
                socket.emit('send-message', newMessage)
            } else {
                Notification('Error', 'Cannot send message', 'warning')
            }
        }
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

    //////////////// Meet-Recording Handler ////////////////
    const handleRecord = async () => {
        if (!meetRecord) {
            navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always",
                    displaySurface: "window"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            }).then(async (stream) => {
                recorder = new RecordRTC(stream, {
                    mimeType: "video/webm\;codecs=vp9",
                    bitsPerSecond: 128000
                });
                recorder.startRecording();
                setMeetRecord(true)

            }).catch((err) => {
                console.log(err)
            })
        } else {
            recorder.stopRecording(() => {
                let blob = recorder.getBlob()
                let date = new Date()
                invokeSaveAsDialog(blob, `Meet Recording ${date}.webm`);
            })
            setMeetRecord(false)
        }
    }
     //////////////// Meet-Recording Handler End ////////////////

    return (
        <>
            {loadingScreen}
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
                            <Button variant="contained" color="primary" onClick={handleRecord}>
                                { meetRecord ? <FiberSmartRecordIcon/> : <FiberManualRecordIcon/> }
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
                                        <h3><Message /> Meeting Chat</h3>
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

export default JoinMeet
