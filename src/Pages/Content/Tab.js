import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Home from '@material-ui/icons/Home'

// components
import Menu from './Menu'

import { useHistory } from 'react-router'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function CenteredTabs({ routes }) {
    const classes = useStyles();

    const history = useHistory()

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" 
                    className={classes.menuButton} 
                    color="inherit" 
                    aria-label="menu"
                    onClick={() => history.push('/') }>
                    <Home />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Meet - In - Room
                </Typography>
                {
                    routes.map((route) => {
                        return (
                            <Button color="inherit" 
                                onClick={() => { history.push(`/${route.path}`) }}  
                            >
                                    # &nbsp; {route.name}
                            </Button>
                        )
                    })
                }
                <Menu/>
            </Toolbar>
        </AppBar>
    );
}

