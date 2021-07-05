import React from 'react';
import { makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Chat from '@material-ui/icons/Chat'
import AccountBox from '@material-ui/icons/AccountBox'

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

function ChatCard({ from, message }) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography variant="subtitle1" color="textSecondary">
                        <AccountBox /> <span style={{ margin: "2px", color: 'black' }}><b>{from}</b></span>
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        <Chat/> {message}
                    </Typography>
                </CardContent>
            </div>
        </Card>
    )
}

export default ChatCard
