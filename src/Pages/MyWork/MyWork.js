import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Card from '../../Components/WorkCard/WorkCard'

// helpers
import post from '../../Helpers/Request/post'

// components
import Notification from '../../Components/Notification/Notification'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

}));


function MyWork() {
    const user = useSelector((state) => state.user)
    const email = useSelector((state) => state.email)
    const classes = useStyles();

    const [fetched, setFetched] = useState(false)
    const [myTasks, setMyTasks] = useState([])
    useEffect(async() => {
        const response = await post('mywork', {
            myEmail: email
        })
        if(response.data && response.data.myWork){
            setMyTasks(response.data.myWork)
        } else{
            Notification('Error', 'Cannot fetch your tasks', 'danger')
        }
        setFetched(true)
    }, [])

    return (
        <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            {
                fetched ? (
                    myTasks && myTasks.map((task) => (
                        <Grid item xs={3} key={myTasks.indexOf(task)}>
                            <Card task={task.task} status={task.status} date={task.date} by={task.by} workId={task.workId}/>
                        </Grid>
                    ))
                ) : (null)
            }
        </Grid>
    )
}

export default MyWork
