import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './CSS/call.css'
//services
import call from '../../Services/Socket/Call/call'

const sendid=999
const users = [
    {name: 'Shivansh', id : '1'},
    {name: 'Mayanak' , id : '2'},
    {name: 'Samarth', id : '3'},
    {name: 'Shivansh', id : '4'},
    {name: 'Mayanak', id : '5'},
    {name: 'Samarth', id : '6'},
    {name: 'Shivansh', id : '7'},
    {name: 'Mayanak', id : '8'},
    {name: 'Samarth', id : '9'},
    {name: 'Shivansh', id : '10'},
    {name: 'Mayanak', id : '11'},
    {name: 'Samarth', id : '12'},
    {name: 'Shivansh', id : '13'},
    {name: 'Mayanak', id : '14'},
    {name: 'Samarth', id : '15'},
    {name: 'Shivansh', id : '16'},
    {name: 'Mayanak', id : '17'},
    {name: 'Samarth', id : '18'},
    {name: 'Shivansh', id : '19'},
    {name: 'Mayanak', id : '20'},
    {name: 'Samarth', id : '21'},
    {name: 'Shivansh', id : '22'},
    {name: 'Mayanak', id : '23'},
    {name: 'Samarth', id : '24'},
    {name: 'Shivansh', id : '25'},
    {name: 'Mayanak', id : '26'},
    {name: 'Samarth', id : '27'},
]

// make call offer
const makeCall = (event)=>{
    let id = event.target.name
    call(id,sendid)
}

function Call() {
    
    return (
        <div id="content">
            <Router>
            <div id="left">
                {
                    users.map((user)=>{
                        return( 
                            <button onClick={makeCall} name={user.id}>Call { user.name }</button>
                        )
                    })
                }
            </div>
            <div id="right">

            </div>
            </Router>
        </div>
    )
}

export default Call
