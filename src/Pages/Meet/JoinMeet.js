import React, {useEffect, useRef, useState} from 'react'
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux'
import socket from '../../Configuration/socket'
import {peer} from '../../Configuration/peer'

//CSS
import './CSS/meet.css'

function JoinMeet() {

    const user = useSelector((state)=>state.user)
    const myVideo = useRef()
    const { id } = useParams();
    const peers = {}

    let videoGrid 

    useEffect(()=>{

        videoGrid = document.getElementById('join-meet-grid')

        socket.emit('join-room', {roomId: id, userId: user})

        socket.on('user-disconnected', (userId) => {
            if (peers[userId]) peers[userId].close()

            console.log('socket disconnected --')
        });

        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((myStream) => {
            myVideo.current.srcObject = myStream

            peer.on('call', call => {
                call.answer(myStream)
                const video = document.createElement('video')
                video.setAttribute("class", "remoteVideo")
                call.on('stream', userVideoStream => {
                  appendVideo(video, userVideoStream)
                })
              })
            
            socket.on('new-user-connect', (userId) => {
                connectPeers(userId, myStream)
            });

        }).catch((error) => {
            console.log("Error in stream ", error)
            alert('Cannot Access Media')
        })

    },[])

    function connectPeers(userId, stream) {
        const call = peer.call(userId, stream)
        const video = document.createElement('video')
        video.setAttribute("class", "remoteVideo")
        call.on('stream', userVideoStream => {
          appendVideo(video, userVideoStream)
        })
        call.on('close', () => {
          video.remove()
        })
      
        peers[userId] = call
    }

    function appendVideo(video, stream) {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
          video.play()
        })
        videoGrid.appendChild(video)
      }


    return (
        <div id='join-meet-grid' ref={videoGrid}>
            <video ref={myVideo} autoPlay className="myVideo"></video>
        </div>
    )
}

export default JoinMeet
