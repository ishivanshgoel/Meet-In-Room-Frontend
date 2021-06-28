import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Work from '@material-ui/icons/Work'
import Email from '@material-ui/icons/Email'
import ThumbUp from '@material-ui/icons/ThumbUp'
import ThumbDown from '@material-ui/icons/ThumbDown'
import Done from '@material-ui/icons/Done'
import { Badge } from 'react-bootstrap'

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

function RoomCard2({ task, status, date, by, workId }) {

    const classes = useStyles();
    const theme = useTheme();

    const [currentStatus, setCurrentStatus] = useState(status)

    const handleUpdateStatus = async (type) => {
        let newStatus = type
        const response = await post('updatestatus', {
            newStatus,
            workId
        })
        if (response.data) {
            Notification('Succeess', 'Status Updated', 'success')
            setCurrentStatus(newStatus)
        } else Notification('Error', 'Cannot update the status', 'warning')
    }

    const buttonDecision = (type) => {
        if (type == 'accept') {
            if (currentStatus == 'assigned') {
                return true
            }
        } else if (type == 'reject') {
            if (currentStatus == 'assigned') {
                return true
            }
        } else if (type == 'done') {
            if (currentStatus == 'inprogress') return true
        }
        return false
    }

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        <Work /> <span style={{ margin: "2px" }}>{task}</span>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        <Email /> <span style={{ margin: "2px" }}>{by}</span>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {
                            currentStatus == 'assigned' ?(
                                <Badge style={{backgroundColor:"blue"}}>Assigned</Badge>
                            ) : currentStatus == 'inprogress' ?(
                                <Badge style={{backgroundColor:"#b2b21e"}}>In Progress</Badge>
                            ) : currentStatus == 'reject' ?(
                                <Badge style={{backgroundColor:"red"}}>Rejected</Badge>
                            ) : currentStatus == 'done' ?(
                                <Badge style={{backgroundColor:"green"}}>Done</Badge>
                            ): (null)
                        }
                        
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    {
                        (buttonDecision('accept') || buttonDecision('reject')) ? (
                            <>
                                <Button variant="contained" color="primary" disabled={!buttonDecision('accept')} className={classes.buttonB} onClick={() => handleUpdateStatus('inprogress')}>
                                    <ThumbUp /> <span style={{ margin: "2px" }}>Accept</span>
                                </Button>
                                <Button variant="contained" color="secondary" disabled={!buttonDecision('reject')} className={classes.buttonB} onClick={() => handleUpdateStatus('reject')}>
                                    <ThumbDown /><span style={{ margin: "2px" }}>Reject</span>
                                </Button>
                            </>
                        ) : (null)
                    }

                    {
                        buttonDecision('done') ? (
                            <Button variant="contained" color="primary" disabled={!buttonDecision('done')} className={classes.buttonB} onClick={() => handleUpdateStatus('done')}>
                                <Done /><span style={{ margin: "2px" }}>Done</span>
                            </Button>
                        ) : (null)
                    }

                </div>
            </div>
        </Card>
    )
}

export default RoomCard2
