import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Card from '../../Components/WorkCard/WorkCard'

// helpers
import post from '../../Helpers/Request/post'

// components
import Notification from '../../Components/Notification/Notification'
import Illustration from '../Static/Illustration'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'

/**
 * @package fetches and displays tasks of user
 * @param {object} myTasks Array of the tasks assigned to the user
 */

function MyWork() {
    const user = useSelector((state) => state.user) // userId from REDUX store
    const email = useSelector((state) => state.email) // userEmail from REDUX store
    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen() // loading screen

    const [fetched, setFetched] = useState(false)
    const [myTasks, setMyTasks] = useState([]) // all the fetched taks
    useEffect(async () => {
        showLoadingScreen()
        const response = await post('mywork', {
            myEmail: email
        })
        if (response.data && response.data.myWork) {
            setMyTasks(response.data.myWork)
            if (response.data.myWork.length > 0) setFetched(true)
        } else {
            Notification('Error', 'Cannot fetch your tasks', 'danger')
        }
        hideLoadingScreen()
    }, [])

    return (
        <>
            {loadingScreen}
            {
                fetched ? (
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        {
                            myTasks && myTasks.map((task) => (
                                <Grid item xs={3} key={myTasks.indexOf(task)}>
                                    <Card task={task.task} status={task.status} date={task.date} by={task.by} workId={task.workId} />
                                </Grid>
                            )) 
                        }
                    </Grid>

                ) : (<Illustration text='No Tasks Found!!' />)
            }
        </>
    )
}

export default MyWork
