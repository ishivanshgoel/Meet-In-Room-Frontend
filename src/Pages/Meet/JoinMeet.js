// import React, { useEffect, useRef, useState } from 'react'
// import { useParams } from "react-router-dom";
// import { useSelector } from 'react-redux'
// import socket from '../../Configuration/socket'
// import { peer } from '../../Configuration/peer'

// //CSS
// import './CSS/meet.css'


// // adding new remove method to Array class //
// Array.prototype.remove = function () {
//   var what, a = arguments, L = a.length, ax;
//   while (L && this.length) {
//     what = a[--L];
//     while ((ax = this.indexOf(what)) !== -1) {
//       this.splice(ax, 1);
//     }
//   }
//   return this;
// }
// // refrence: https://stackoverflow.com/questions/3954438/how-to-remove-item-from-array-by-value //

// function JoinMeet() {

//   const user = useSelector((state) => state.user)
//   const [sideComponent, setSideComponent] = useState("participants")
//   const [messages, setMessages] = useState([]) //chat messages
//   const [cameraDevices, setCameraDevice] = useState([])
//   const [inputAudioDevices, setInputAudioDevice] = useState([])
//   const [outputAudioDevices, setOutputAudioDevice] = useState([])
//   const [showVideo, setShowVideo] = useState(true)
//   const myVideo = useRef() // reference to local video
//   const { id } = useParams(); // meeting room id
//   const peers = {} // map of connected peers
//   const videos = {}
//   let allUserIds = []



//   let videoGrid
//   let myGlobalStream

//   // camera constraints
//   function setConstraints() {
//     const constraints = {
//       'audio': {
//         'echoCancellation': true,
//       },
//       'video': true
//     }
//     return constraints
//   }

//   // Open camera with at least minWidth and minHeight capabilities
//   async function openStream() {
//     let cons = setConstraints()
//     return await navigator.mediaDevices.getUserMedia(cons);
//   }

//   useEffect(async () => {

//     // refernce to video grid
//     videoGrid = document.getElementById('video-grid')

//     // join the meeting room
//     socket.emit('join-room', { roomId: id, userId: user })

//     // event fired when any of the user in the room gets disconnected
//     socket.on('user-disconnected', (userId) => {
//       if (peers[userId]) peers[userId].close()
//       allUserIds.remove(userId)
//       console.log('socket disconnected --')
//     });

//     // new message
//     socket.on('new-message', ({ from, message }) => {
//       console.log("Messages before receiving ", messages)
//       let newMessage = { from, message }
//       let newSetMessages = [
//         ...messages,
//         newMessage
//       ]
//       setMessages(newSetMessages)
//       console.log("Messages after receiving ", messages)
//     })

//     // get stream
//     myGlobalStream = await openStream()

//     // set to local element
//     myVideo.current.srcObject = myGlobalStream

//     // listen for incoming calls
//     peer.on('call', call => {

//       // metadat from call
//       let metadata = call.metadata

//       // send you stream
//       call.answer(myGlobalStream)

//       // listen for other users stream
//       const video = document.createElement('video')
//       // video.setAttribute("className", "video remoteVideo")

//       // maintain list of all connected peers
//       allUserIds.push(metadata.userId)

//       // append user stream to grid
//       call.on('stream', (stream) => {
//         appendVideo(video, stream, metadata.userId)
//       })

//     })

//     // when someone connects to our room
//     socket.on('new-user-connect', (userId) => {
//       connectPeers(userId)
//     })

//   }, [])


//   // when someone joins our room, call them using their peer id
//   function connectPeers(userId) {

//     // send userId in metadata of call
//     let options = { metadata: { "type": "video-call", "userId": userId } }
//     const call = peer.call(userId, myGlobalStream, options)
//     const video = document.createElement('video')

//     // remote stream
//     call.on('stream', userVideoStream => {
//       appendVideo(video, userVideoStream, userId)
//     })

//     // close video
//     call.on('close', () => {
//       video.remove()
//     })

//     peers[userId] = call
//   }

//   // append the remote user's stream to video grid
//   function appendVideo(video, stream, userId) {
//     video.srcObject = stream
//     video.addEventListener('loadedmetadata', () => {
//       video.play()
//     })
//     videos[userId] = video

//     videoGrid.appendChild(video)
//   }

//   // cut call
//   function handleLeaveMeet(event) {
//     console.log('Leave meet fired')
//     peer.disconnect()
//   }

//   // toggle sidebar
//   function toggleRightBar() {
//     if (sideComponent == "participants") setSideComponent("chat")
//     else setSideComponent("participants")
//   }

//   // send message
//   function handleSendMessage(event) {
//     if (event.key === 'Enter') {
//       let message = event.target.value
//       event.target.value = ""
//       console.log("Messages Before Sending ", messages)
//       let newMessage = { from: user, message: message }
//       let newSetMessages = [
//         ...messages,
//         newMessage
//       ]
//       setMessages(newSetMessages)
//       console.log("Messages After Sending ", messages)
//       socket.emit('send-message', newMessage)
//     }
//   }


//   // set unmute icon
//   function setUnmuteButton() {
//     let ele = document.getElementById('meet-microphone')
//     ele.setAttribute('class', 'microphone slash icon meet-icon')
//   }

//   // set mute icon
//   function setMuteButton() {
//     let ele = document.getElementById('meet-microphone')
//     ele.setAttribute('class', 'microphone icon meet-icon')
//   }

//   // mute microphone
//   function handleMute() {
//     const enabled = myGlobalStream.getAudioTracks()[0].enabled;
//     if (enabled) {
//       myGlobalStream.getAudioTracks()[0].enabled = false;
//       setUnmuteButton();
//     } else {
//       setMuteButton();
//       myGlobalStream.getAudioTracks()[0].enabled = true;
//     }
//   }

//   function setPlayVideo() {
//     let ele = document.getElementById('meet-video')
//     ele.setAttribute('class', 'pause circle outline icon meet-icon')
//   }

//   function setStopVideo() {
//     let ele = document.getElementById('meet-video')
//     ele.setAttribute('class', 'video icon meet-icon')
//   }


//   // on/off video
//   function handleVideo() {
//     myGlobalStream.getVideoTracks()[0].enabled = !(myGlobalStream.getVideoTracks()[0].enabled)
//     // let enabled = myGlobalStream.getVideoTracks()[0].enabled;
//     // if (enabled) {
//     //   setPlayVideo()
//     //   setShowVideo(false)
//     // } else {
//     //   setStopVideo()
//     //   setShowVideo(true)
//     // }
//   }

//   // to filter connected devices
//   function getConnectedDevices(type, callback) {
//     navigator.mediaDevices.enumerateDevices()
//       .then(devices => {
//         const filtered = devices.filter(device => device.kind === type);
//         callback(filtered)
//       });
//   }

//   // get all input audio devices
//   function getAllInputAudio() {
//     getConnectedDevices('audioinput', microphones => setInputAudioDevice(microphones))
//     setSideComponent("listinputaudio")
//   }

//   // get all output audio devices
//   function getAllOutputAudio() {
//     getConnectedDevices('audiooutput', speakers => setOutputAudioDevice(speakers))
//     setSideComponent("listoutputaudio")
//   }

//   // get all cameras
//   function getAllCameras() {
//     getConnectedDevices('videoinput', cameras => setCameraDevice(cameras))
//     setSideComponent("listcameras")
//   }

//   // change camera
//   function changeCamera(event) {
//     console.log("Output Device ", event.target.value)
//     const stream = openStream(event.target.value)
//   }

//   // change output device
//   function changeOutputDevice(event) {
//     console.log("Output Device ", event.target.value)
//   }

//   // change input device
//   function changeInputDevice(event) {
//     console.log("Output Device ", event.target.value)
//   }

//   return (
//     <div className="meet">
//       <div className="meet-left">
//         <div className="meet-videos">
//           <div id="video-grid" ref={videoGrid}>
//             <video ref={myVideo} autoPlay
//               className="video myVideo"
//               muted="muted"
//             > </video>
//           </div>
//         </div>
//         <div className="meet-bottom">
//           <div className="meet-bottom-block">
//             <div className="meet-bottom-button meet-mute-button" onClick={handleMute}>
//               <i className="microphone icon meet-icon" id="meet-microphone"></i>
//             </div>
//             <div className="meet-bottom-button meet-video-button" onClick={handleVideo}>
//               <i className="video icon meet-icon" id="meet-video"></i>
//             </div>
//             <div className="meet-bottom-button" onClick={toggleRightBar}>
//               <i className="hand paper icon meet-icon"></i>
//             </div>
//             <div className="meet-bottom-button" onClick={handleLeaveMeet}>
//               <i className="phone icon meet-icon custom-phone"></i>
//             </div>
//             <div className="meet-bottom-button" onClick={toggleRightBar}>
//               <i className="users icon meet-icon"></i>
//             </div>
//             <div className="meet-bottom-button" onClick={toggleRightBar}>
//               <i className="wechat icon meet-icon"></i>
//             </div>
//             <div className="meet-bottom-button" data-bs-toggle="dropdown" aria-expanded="false">
//               <i className="chevron circle up icon meet-icon"></i>
//             </div>
//             <ul className="dropdown-menu">
//               <li><span className="dropdown-item meet-dropdown-item" onClick={getAllInputAudio}><i className="microphone icon"></i> Change Microphone</span></li>
//               <li><span className="dropdown-item meet-dropdown-item" onClick={getAllCameras}><i className="camera icon"></i> Change Camera</span></li>
//               <li><span className="dropdown-item meet-dropdown-item" onClick={getAllOutputAudio}><i className="headphones icon"></i> Change Speakers</span></li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       {
//         sideComponent == "chat" && (
//           <div className="meet-right">
//             <div className="meet-header">
//               <h6>Chat</h6>
//             </div>
//             <div className="meet-chat-window">
//               <ul className="messages">
//                 {
//                   messages && messages.map(({ from, message }, index) =>
//                     from === user ? (
//                       <div id={`${from}-${index}`} className="myMessage">
//                         <p>You</p>
//                         <p>{message}</p>
//                       </div>
//                     ) : (
//                       <div id={`${from}-${index}`} className="peerMessage">
//                         <p>{from}</p>
//                         <p>{message}</p>
//                       </div>
//                     )
//                   )
//                 }
//               </ul>
//             </div>
//             <div className="meet-message-container">
//               <input type="text" placeholder="Type message here..." onKeyPress={handleSendMessage} />
//             </div>
//           </div>
//         )
//       }
//       {
//         sideComponent == "participants" && (
//           <div className="meet-right">
//             <div className="meet-header">
//               <h6>Participants</h6>
//             </div>
//             <div className="meet-chat-window">
//               <ul className="messages">

//               </ul>
//             </div>
//           </div>
//         )
//       }
//       {
//         sideComponent == "listcameras" && (
//           <div className="meet-right">
//             <div className="meet-header">
//               <h6>List Cameras</h6>
//             </div>
//             <div className="meet-chat-window">
//               <ul className="messages">
//                 <select class="btn btn-outline-secondary dropdown-toggle" type="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false" onChange={changeCamera}>
//                   Select Camera
//                   {
//                     cameraDevices && cameraDevices.map((device) =>
//                       (<option value={device.id}>{device.label}</option>)
//                     )
//                   }
//                 </select>
//               </ul>
//             </div>
//           </div>
//         )
//       }
//       {
//         sideComponent == "listoutputaudio" && (
//           <div className="meet-right">
//             <div className="meet-header">
//               <h6>List Output Audio</h6>
//             </div>
//             <div className="meet-chat-window">
//               <ul className="messages">
//                 <select class="btn btn-outline-secondary dropdown-toggle" type="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false" onChange={changeOutputDevice}>
//                   Select Output Device
//                   {
//                     outputAudioDevices && outputAudioDevices.map((device) =>
//                       (<option value={device.id}>{device.label}</option>)
//                     )
//                   }
//                 </select>
//               </ul>
//             </div>
//           </div>
//         )
//       }
//       {
//         sideComponent == "listinputaudio" && (
//           <div className="meet-right">
//             <div className="meet-header">
//               <h6>List Input Audio</h6>
//             </div>
//             <div className="meet-chat-window">
//               <ul className="messages">
//                 <select class="btn btn-outline-secondary dropdown-toggle" type="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false" onChange={changeInputDevice}>
//                   Select Input Device
//                   {
//                     inputAudioDevices && inputAudioDevices.map((device) =>
//                       (<option value={device.id}>{device.label}</option>)
//                     )
//                   }
//                 </select>
//               </ul>
//             </div>
//           </div>
//         )
//       }
//     </div>
//   )
// }

// export default JoinMeet
