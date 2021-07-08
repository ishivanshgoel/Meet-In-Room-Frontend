import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Work from '@material-ui/icons/Work'
import Email from '@material-ui/icons/Email'
import ThumbUp from '@material-ui/icons/ThumbUp'
import ThumbDown from '@material-ui/icons/ThumbDown'
import VideoCall from '@material-ui/icons/VideoCall'
import Add from '@material-ui/icons/Add'
import Group from '@material-ui/icons/Group'
import Done from '@material-ui/icons/Done'

// helpers
import post from '../../Helpers/Request/post'

import Notification from '../../Components/Notification/Notification'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        margin: 20
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    buttonB: {
        margin: 10
    }
}));

function RoomCard({ name, roomId, type }) {

    const classes = useStyles();
    const theme = useTheme();

    const history = useHistory()

    let handleJoinRoom = (roomId) => {
        history.push(`/team/${roomId}/chat`)
    }

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h6" variant="h6">
                        <Group /> <span style={{ margin: "2px" }}>{name.toUpperCase()}</span>
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <Button variant="contained" color="primary" className={classes.buttonB} onClick={()=>handleJoinRoom(roomId)}>
                        <VideoCall /><span style={{ margin: "2px" }}>Open</span>
                    </Button>
                    {
                        type == 'owner' ? (
                            <Button variant="contained" color="primary" className={classes.buttonB} onClick={() => history.push(`/team/${roomId}/add`)}>
                                <Add /><span style={{ margin: "2px" }}>Add People</span>
                            </Button>
                        ) : (null)
                    }

                </div>
            </div>
        </Card>
    )
}

export default RoomCard
