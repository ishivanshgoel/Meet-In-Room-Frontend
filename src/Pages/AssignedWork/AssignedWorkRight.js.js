import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'

// components
import AssignCard from '../../Components/AssignCard/AssignCard'
import Notification from '../../Components/Notification/Notification'

// Helpers
import post from '../../Helpers/Request/post'

const useStyles = makeStyles({
    textField: {
        position: 'fixed',
        bottom: 4
    },
    submitButton: {
        position: 'fixed',
        bottom: 4,
        right: 10
    }
});

export default function ChatRight({ userId, userEmail }) {
    const classes = useStyles();
    const user = useSelector((state) => state.user)
    const email = useSelector((state) => state.email)

    const [fetched, setFetched] = useState(false)
    const [task, setTask] = useState(null)
    const [tasks, setTasks] = useState([])

    useEffect(async () => {

        let response = await post('assignedwork', {
            myEmail: email,
            userEmail: userEmail
        })

        if (response.data && response.data.work) {
            setTasks(response.data.work)
            setFetched(true)
            Notification('Success', 'Fetched', 'success')
        } else Notification('Warning', 'Cannot fetch', 'warning')

    }, [])

    const handleSubmit = async () => {
        let newTask = {
            status: 'assigned',
            task: task,
            date: new Date(),
            by: email,
            to: userEmail
        }
        const response = await post('assign', {
            myId: user,
            userId: userId,
            task: newTask
        })

        if (response.data && response.data.workId) {
            newTask = {
                ...newTask,
                workId: response.data.workId
            }

            setTasks([
                ...tasks,
                newTask
            ])
            Notification('Success', 'Task Assigned', 'success')
        } else Notification('Error', 'Some Error Occured', 'warning')
    }

    return (
        <div>
            {
                fetched ? (
                    tasks && tasks.map((task) => (
                        <AssignCard task={task.task} status={task.status} workId={task.workId} date={task.date} />
                    ))
                ) : (null)
            }
            <TextField
                style={{ margin: 2, width: 1000 }}
                placeholder="Type Something"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                className={classes.textField}
                onChange={(event) => setTask(event.target.value)} />
            <button onClick={handleSubmit} className={classes.submitButton}>Submit</button>
        </div>

    );
}