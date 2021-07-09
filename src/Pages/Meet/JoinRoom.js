import React, { useRef, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { useHistory } from 'react-router'

import './CSS/meet.css'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Call from '@material-ui/icons/Call'
import CallEnd from '@material-ui/icons/CallEnd'

// components
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'

/**
 * @package waiting room before joing video meeting.
 * @param {function} handleMeetJoin Join the meeting.
 * @param {function} handleMoveBack Move back, incase don't want to join the meeting.
 */

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
}));

let myStreamGlobal

function JoinRoom() {

    // reference to video element
    const myVideo = useRef()

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()

    const history = useHistory()

    // room id
    const { id } = useParams();

    useEffect(async () => {
        showLoadingScreen()

        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((myStream) => {
            myStreamGlobal = myStream
            myVideo.current.srcObject = myStream
            
        }).catch((error) => {
            console.log("Error in stream ", error)
            
        })
        
        hideLoadingScreen()
    }, [])

    let handleMeetJoin = (event) => {
        const tracks = myStreamGlobal.getTracks()
        tracks.forEach((track) => track.stop())
        history.push(`/team/${id}/meet`)
    }

    let handleMoveBack = (event) => {
        const tracks = myStreamGlobal.getTracks()
        tracks.forEach((track) => track.stop())
        window.location.href = "/team"
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {loadingScreen}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <video ref={myVideo} autoPlay className="meet-prejoin-video" muted="muted"></video>

                        <br></br>
                        <br></br>

                        <div style={{ margin: "30px" }}>
                            <ButtonGroup>
                                <Button color="primary" onClick={handleMeetJoin}><Call /><span style={{ margin: "10px" }}>Join</span></Button>
                                <Button color="secondary" onClick={handleMoveBack}><CallEnd /><span style={{ margin: "10px" }}>Decline</span></Button>
                            </ButtonGroup>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default JoinRoom
