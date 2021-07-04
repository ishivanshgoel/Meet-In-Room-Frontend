import React, { useRef, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { useHistory } from 'react-router'

import './CSS/meet.css'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Call from '@material-ui/icons/Call'
import CallEnd from '@material-ui/icons/CallEnd'

import { getAllInputAudio, getAllOutputAudio, getAllCameras } from './getConnectedDevices'

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

    // media check
    const [mediaCheck, setMediaCheck] = useState(false)

    // list of devices
    const [cameraDevices, setCameraDevices] = useState([])
    const [inputAudio, setInputAudio] = useState([])
    const [outputAudio, setOutputAudio] = useState([])

    // selected devices
    const [camera, setCamera] = useState()
    const [mic, setMic] = useState()
    const [speaker, setSpeaker] = useState()

    const history = useHistory()

    // room id
    const { id } = useParams();

    useEffect(async () => {

        await setCameraDevices(await getAllCameras())
        await setInputAudio(await getAllInputAudio())
        await setOutputAudio(await getAllOutputAudio())

        console.log("get all cameras ", cameraDevices)
        console.log("get all input audio ", inputAudio)
        console.log("get all output audio ", outputAudio)
        setCamera(cameraDevices[0])
        setMic(inputAudio[0])
        setSpeaker(outputAudio[0])

        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((myStream) => {
            myStreamGlobal = myStream
            myVideo.current.srcObject = myStream
            setMediaCheck(true)
        }).catch((error) => {
            console.log("Error in stream ", error)
            alert('Cannot Access Media')
        })

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
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <video ref={myVideo} autoPlay className="meet-prejoin-video" muted="muted"></video>

                        <br></br>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Camera</InputLabel>
                            <Select
                                value={camera}
                                id="join-room-camera"
                            >
                                {
                                    cameraDevices && cameraDevices.map((device) => (
                                        <MenuItem value={device.deviceId} key={device.deviceId} onClick={() => { setCamera(device.deviceId) }}>{device.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel>Input Audio</InputLabel>
                            <Select
                                value={mic}
                                id="join-room-mic"
                            >
                                {
                                    inputAudio && inputAudio.map((device) => (
                                        <MenuItem value={device.deviceId} key={device.deviceId} onClick={() => { setSpeaker(device.deviceId) }}>{device.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <FormControl className={classes.formControl}>
                            <InputLabel>Output Audio</InputLabel>
                            <Select
                                value={speaker}
                                id="join-room-audio"
                            >
                                {
                                    outputAudio && outputAudio.map((device) => (
                                        <MenuItem value={device.deviceId} key={device.deviceId} onClick={() => { setMic(device.deviceId) }}>{device.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

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
