import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop'

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
  }));

function LoadingScreen() {
    
    const classes = useStyles()

    return (
        <Backdrop className={classes.backdrop} open={true}>
            <CircularProgress />
        </Backdrop>
    )
}

export default LoadingScreen
