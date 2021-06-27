import React, {useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

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
        const response = await post('updatestatus',{
            newStatus,
            workId
        })
        if(response.data){
            Notification('Succeess', 'Status Updated', 'success')
            setCurrentStatus(newStatus)
        } else Notification('Error', 'Cannot update the status', 'warning')
    }

    const buttonDecision = (type)=>{
        if(type=='accept'){
            if(currentStatus=='assigned'){
                return true
            }
        } else if (type=='reject'){
            if(currentStatus=='assigned'){
                return true
            }
        } else if (type=='done'){
            if(currentStatus=='inprogress') return true
        }
        return false
    }

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {task}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Assigned By: {by}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Status: {currentStatus}
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <Button variant="contained" color="primary" disabled={!buttonDecision('accept')} className={classes.buttonB} onClick={()=>handleUpdateStatus('inprogress')}>
                        Accept
                    </Button>
                    <Button variant="contained" color="secondary" disabled={!buttonDecision('reject')} className={classes.buttonB} onClick={()=>handleUpdateStatus('reject')}>
                        Reject
                    </Button>
                    <Button variant="contained" color="primary" disabled={!buttonDecision('done')} className={classes.buttonB} onClick={()=>handleUpdateStatus('done')}>
                        Done
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default RoomCard2
