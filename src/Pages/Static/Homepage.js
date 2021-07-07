import React from 'react'
import { useHistory } from 'react-router'
import SideImage from '../Static/microsoft_teams.png'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import './CSS/homepage.css'
import WorkIcon from '@material-ui/icons/Work'
import AssignmentIcon from '@material-ui/icons/Assignment'
import GroupIcon from '@material-ui/icons/Group'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}))

function Homepage() {
    const classes = useStyles()
    const history = useHistory()

    return (
        <div className="container">
        <div className="row">
            <div className="col-sm-6 col-12 home-side-panel">
                <img className="img-responsive home-side-image" 
                    alt="image" width="80%" height="auto" 
                    src={SideImage}></img>
            </div>
            <div className="col-sm-6 col-12 home-right-panel">
                <div>
                    <h1>Meet-In-Room</h1>
                </div>
                <div>
                    A hasstle free organising experience, 
                        so that you can focus on your work!!
                </div>
                <br></br>
                <br></br>
                <br></br>
                <div className={classes.root}>
                    <Paper elevation={3} className="home-right-panel-card">
                        <WorkIcon 
                            style={{ fontSize: 60 }} 
                        />
                        <Button onClick={()=> history.push("/work")}>My Work</Button>
                    </Paper>
                    <Paper elevation={3} className="home-right-panel-card">
                        <AssignmentIcon 
                            style={{ fontSize: 60 }}
                        />
                        <Button onClick={()=> history.push("/assign")}>Assign Work</Button>
                    </Paper>
                    <Paper elevation={3} className="home-right-panel-card">
                        <GroupIcon 
                            style={{ fontSize: 60 }}
                        />
                        <Button onClick={()=> history.push("/team")}>My Teams</Button>
                    </Paper>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Homepage
