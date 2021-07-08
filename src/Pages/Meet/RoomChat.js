import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import socket from '../.././Configuration/socket'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Send from '@material-ui/icons/Send'
import Call from '@material-ui/icons/Call'
import { SETMESSAGE, SETMESSAGES } from '../../Reducers/actionTypes'

// CSS
import './CSS/roomchat.css'

// components
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'
import ChatCard from '../../Components/ChatCard/ChatCard'
import Notification from '../../Components/Notification/Notification'

// Helpers
import post from '../../Helpers/Request/post'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        minHeight: "100vh"
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    textField: {
        position: 'fixed',
        bottom: 4,
        left: 5
    },
    submitButton: {
        position: 'fixed',
        bottom: 20,
        right: 80
    }
}));


function RoomChat() {

    const user = useSelector((state) => state.user)
    const email = useSelector((state) => state.email)
    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()

    const [newMessage, setNewMessage] = useState(null)

    // all messages
    const messages = useSelector((state) => state.messages)

    const history = useHistory()
    const dispatch = useDispatch()

    const [fetched, setFetched] = useState(false)

    // room id
    const { id } = useParams();

    let count = 0;
    useEffect(async () => {
        showLoadingScreen()
        // join the meeting room
        socket.emit('join-room', { roomId: id, userId: user, userEmail: email })

        socket.on('new-room-message', ({ from, message }) => {
            let gotMessage = { from, message }
            count+=1
            alert(count)
            dispatch({
                type: SETMESSAGE,
                newMessage: gotMessage
            })

        })


        // 1. fetch all the previous chats
        const response = await post('allMessages', {
            roomId: id,
        })

        if (response.data) {
            console.log("All Messages ", response.data)
            // set messages in store
            dispatch({
                type: SETMESSAGES,
                allMessages: response.data
            })

            setFetched(true)
        } else {
            Notification('Error', 'Cannot fetch chat', 'warning')
        }

        setFetched(true)

        socket.on('new-message', ({ from, message }) => {
            dispatch({
                type: SETMESSAGE,
                newMessage: { from, message }
            })
        })
        hideLoadingScreen()
    }, [])

    const handleSubmit = async (event) => {

        // in post request send room id 
        // and chat to state variable
        showLoadingScreen()
        const response = await post('sendMessage', {
            roomId: id,
            from: email,
            message: newMessage
        })

        if (response.data) {
            dispatch({
                type: SETMESSAGE,
                newMessage: { from: email, message: newMessage }
            })
            socket.emit('send-message', { from: email, message: newMessage })
            let ele = document.getElementById('send-message-field')
            ele.value = ""
        } else {
            Notification('Error', 'Cannot send message', 'warning')
        }
        hideLoadingScreen()
    }

    // send message on keyPress => Enter
    const handleSendMessage = (event)=>{
        if(event.key === 'Enter'){
            handleSubmit()
        }
    }


    // handle meeting join
    const handleMeetJoin = () => {
        history.push(`/team/${id}`)
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {loadingScreen}
            <div className="room-join-meet">
                <Button variant="contained" color="primary" onClick={handleMeetJoin}><Call /><span style={{ margin: "10px" }}>Join Meet</span></Button>
            </div>

            <div>
                {
                    fetched ? (
                        messages && messages.map((message) => (
                            <ChatCard from={message.from} message={message.message} />
                        ))
                    ) : (null)
                }
            </div>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>


            <TextField
                style={{ margin: 2, width: 1500, backgroundColor: 'white' }}
                placeholder="Type Something"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                className={classes.textField}
                id="send-message-field"
                onKeyPress={handleSendMessage}
                onChange={(event) => setNewMessage(event.target.value)} />
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Send />}
                onClick={handleSubmit}
                className={classes.submitButton}
            >
                Send
            </Button>
        </div>
    )
}

export default RoomChat
