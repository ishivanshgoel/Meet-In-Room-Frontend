import React from 'react'
import Image from './illustration.png'
import './CSS/illustration.css'

function Illustration({text}) {
    return (
        <div className="illustration-main">
            <div className="illustration-main-image">
                <img src={Image}></img>
            </div>
            <div className="illustration-main-text">
                <center><h1>{text}</h1></center>
            </div>
        </div>
    )
}

export default Illustration
