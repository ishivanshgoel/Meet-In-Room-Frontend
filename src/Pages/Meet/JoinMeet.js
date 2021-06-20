import React, { useEffect, useRef, useState } from 'react'
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux'
import socket from '../../Configuration/socket'
import { peer } from '../../Configuration/peer'

//CSS
import './CSS/meet.css'

function JoinMeet() {

  const user = useSelector((state) => state.user)
  const myVideo = useRef()
  const { id } = useParams();
  const peers = {}

  let videoGrid

  useEffect(() => {

    videoGrid = document.getElementById('video-grid')

    // join the meeting room
    socket.emit('join-room', { roomId: id, userId: user })

    // event fired when any of the user in the room gets disconnected
    socket.on('user-disconnected', (userId) => {
      if (peers[userId]) peers[userId].close()
      console.log('socket disconnected --')
    });

    // get user media - camera and video
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then((myStream) => {

      // set local stream ref. to myVideo
      myVideo.current.srcObject = myStream

      // listen for incoming calls
      peer.on('call', call => {

        // answer and send in your stream
        call.answer(myStream)

        // listen for other users stream
        const video = document.createElement('video')
        // video.setAttribute("className", "video remoteVideo")

        call.on('stream', (stream) => {
          appendVideo(video, stream)
        })

      })

      // when someone connects to our room
      socket.on('new-user-connect', (userId) => {
        connectPeers(userId, myStream)
      });

    }).catch((error) => {
      console.log("Error in stream ", error)
      alert('Cannot Access Media')
    })

  }, [])


  // when someone joins our room, call them using their peer id
  function connectPeers(userId, stream) {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
      appendVideo(video, userVideoStream)
    })

    //
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call
  }

  // append the remote user's stream to video grid
  function appendVideo(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.appendChild(video)
  }


  return (
    <div className="meet">
      <div className="meet-left">
        <div className="meet-videos">
          <div id="video-grid" ref={videoGrid}>
            <video ref={myVideo} autoPlay className="video myVideo" muted="muted"></video>
          </div>
        </div>
        <div className="meet-bottom">
          <div className="meet-bottom-block">
            <div className="meet-bottom-button meet-mute-button">
              <i className="microphone icon meet-icon"></i>
            </div>
            <div className="meet-bottom-button meet-video-button" >
              <i className="video icon meet-icon"></i>
            </div>
            <div className="meet-bottom-button">
              <i className="phone icon meet-icon custom-phone"></i>
            </div>
            <div className="meet-bottom-button">
              <i className="users icon meet-icon"></i>
            </div>
            <div className="meet-bottom-button">
              <i className="wechat icon meet-icon"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="meet-right">
        <div className="meet-header">
          <h6>Chat</h6>
        </div>
        <div className="meet-chat-window">
          <ul className="messages">

          </ul>
        </div>
        <div className="meet-message-container">
          <input id="chat-message" type="text" placeholder="Type message here..." />
        </div>
      </div>
    </div>
  )
}

export default JoinMeet
