import React, { useRef, useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { useHistory } from 'react-router'
import { Divider, Grid, Segment, Button } from 'semantic-ui-react'

function JoinRoom() {

    const myVideo = useRef()
    const [mediaCheck, setMediaCheck]=useState(false)

    const history = useHistory()

    const { id } = useParams();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((myStream) => {
            myVideo.current.srcObject = myStream
            setMediaCheck(true)
        }).catch((error) => {
            console.log("Error in stream ", error)
            alert('Cannot Access Media')
        })

    }, [])

    let handleMeetJoin = (event)=>{

        if(mediaCheck){
            history.push(`/meet/${id}/join`)
        } else{
            alert('Cannot Access Media')
        }

    }

    let handleMoveBack = (event)=>{

        // handle move back

    }



    return (
        <Segment>
            <Grid columns={2} relaxed='very'>
                <Grid.Column>
                    <video ref={myVideo} autoPlay style={{ width: "300px" }} muted="muted"></video>
                </Grid.Column>
                <Grid.Column>
                    <Button inverted color='green' onClick={handleMeetJoin}>
                        Join
                    </Button>
                    <Button inverted color='red' onClick={handleMoveBack}>
                        Decline
                    </Button>
                </Grid.Column>
            </Grid>
            <Divider vertical>And</Divider>
        </Segment>
    )
}

export default JoinRoom
