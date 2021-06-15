import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

// components
import './CSS/call.css'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'
import Notification from '../../Components/Notification/Notification'
import { Button } from 'semantic-ui-react'
import CallScreen from '../../Components/CallScreen/CallScreen'

//services
import get from '../../Services/Request/get'
import post from '../../Services/Request/post'



function Call() {

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()
    const [users, setUsers] = useState({
        fetched: false,
        contactList: []
    })
    const [callScreen, showCallScreen, hideCallScreen] = CallScreen()

    
    const user = useSelector(state => state.user)

    // make call offer
    const makeCall = async (event) => {
        let rid = event.target.name
        const response = await post('calloffer',{
            sender: user,
            receiver: rid
        })

        if(response.data){
            // show call screen
            // showCallScreen(true)
        } else{
            Notification('Warning', 'Could not place this call', 'warning')
        }

    }


    useEffect(async () => {

        // start the loading screen
        showLoadingScreen()
        const response = await get('contactlist')

        if (response.data) {

            // set the contact list
            setUsers({
                ...users,
                fetched: true,
                contactList: response.data
            })
        } else {
            Notification('Error', 'Cannot fetch your contact list', 'danger')
        }

        // time to hide loading screen
        hideLoadingScreen()
    }, [])


    /**
     * display loading screen until all the users list is fetched
     */
    return (
        users.fetched ? (
            <div id="content">
                {callScreen}
                <Router>
                    <div id="content-left">
                        <div id="content-left-tag">
                            Contact List
                        </div>
                        {
                            users.contactList.map((user) => {
                                return (
                                    <Button icon="phone square" content={user.email} onClick={makeCall} 
                                                style={{
                                                    marginTop: "10px", 
                                                    width: "100%",
                                                    height: "40px",
                                                    fontSize: "20px",
                                                    padding: "5px" 
                                                }} 
                                            name={user.id}
                                    />
                                )
                            })
                        }
                    </div>

                    <div id="content-right">

                    </div>
                </Router>
            </div>
        ) : (
            <div>
                {loadingScreen}
            </div>
        )
    )
}

export default Call
