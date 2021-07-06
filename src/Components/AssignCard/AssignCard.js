import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Work from '@material-ui/icons/Work'
import Email from '@material-ui/icons/Email'
import { Badge } from 'react-bootstrap'

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

function AssignCard({ task, status, date, workId }) {

    const classes = useStyles();
    const [currentStatus, setCurrentStatus] = useState(status)

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                        <Work /> <span style={{ margin: "2px" }}>{task}</span>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        <Email /> <span style={{ margin: "2px" }}>You</span>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {
                            currentStatus == 'assigned' ? (
                                <Badge style={{ backgroundColor: "blue" }}>Assigned</Badge>
                            ) : currentStatus == 'inprogress' ? (
                                <Badge style={{ backgroundColor: "#b2b21e" }}>In Progress</Badge>
                            ) : currentStatus == 'reject' ? (
                                <Badge style={{ backgroundColor: "red" }}>Rejected</Badge>
                            ) : currentStatus == 'done' ? (
                                <Badge style={{ backgroundColor: "green" }}>Done</Badge>
                            ) : (null)
                        }
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Work Id: {workId}
                    </Typography>
                </CardContent>
            </div>
        </Card>
    )
}

export default AssignCard
