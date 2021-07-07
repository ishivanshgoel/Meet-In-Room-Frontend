import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Home from '@material-ui/icons/Home'

// icons
import Work from '@material-ui/icons/Work'
import Assignment from '@material-ui/icons/Assessment'
import Group from '@material-ui/icons/Group'

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
                    aria-label="menu">
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
                                    <Icon> {route.icon ? route.icon : '#'} </Icon> &nbsp; {route.name}
                            </Button>
                        )
                    })
                }
                <Menu/>
            </Toolbar>
        </AppBar>
    );
}

