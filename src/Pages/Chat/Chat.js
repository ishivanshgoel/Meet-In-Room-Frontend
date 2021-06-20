import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { useHistory } from 'react-router'

// components
import './CSS/chat.css'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'
import Notification from '../../Components/Notification/Notification'
import { Button } from 'semantic-ui-react'

//services
import get from '../../Helpers/Request/get'

function Chat() {

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()
    const [users, setUsers] = useState({
        fetched: false,
        contactList: []
    })
    
    const user = useSelector(state => state.user)
    // const dispatch = useDispatch()

    const history = useHistory()

    useEffect(async () => {

        // start the loading screen
        showLoadingScreen()
        const response = await get('contactlist')

        // initialize user
        
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


    // make call offer
    const makeCall = async (event) => {
        let rid = event.target.name

    }

    return (
        users.fetched ? (
            <div class="col-12">
                <Router>
                    <div id="content-left">
                        <div id="content-left-tag">
                            Contact List
                        </div>
                        {
                            users.contactList.map((user) => {
                                return (
                                    <Button icon="phone square" content={user.email} 
                                            onClick={makeCall} 
                                            style={{
                                                marginTop: "10px", 
                                                width: "100%",
                                                height: "40px",
                                                fontSize: "20px",
                                                padding: "5px",
                                             
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

export default Chat
