import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { initPeer } from '../../Configuration/peer'
import { makeStyles } from '@material-ui/core/styles'

// Pages
import AssignedWork from '../AssignedWork/AssignedWork'
import MyWork from '../MyWork/MyWork'
import Meet from '../Meet/Meet'
import JoinRoom from '../Meet/JoinRoom'
import JoinMeet from '../Meet/JoinMeet'
import NotFound from '../Static/NotFound'

// components
import Tab from './Tab'

/**
 * @param routes array of all the routes in application
 * @param user user-id stored in redux store
 */

// routes
const routes = [
  { path: '', component: MyWork, name: 'My Work'},
  { path: 'assign', component: AssignedWork, name: 'Assign Work' },
  { path: 'team', component: Meet, name: 'Teams' },
]

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

function Content() {

  const user = useSelector(state => state.user)

  const classes = useStyles();

  useEffect(() => {
    // initialize peer connection
    initPeer(user)
  }, [])

  return (
    <Router>
      <Tab routes={routes} />
      {/* <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}> */}
            <Switch>
              {/* <Route exact path="/" component={Welcome} /> */}
              {
                routes.map((route) => {
                  return (<Route
                    exact
                    path={"/" + route.path}
                    component={route.component}
                  />)
                })
              }
              <Route exact path="/team/:id" component={JoinRoom} />
              <Route exact path="/team/:id/meet" component={JoinMeet} />
              <Route component={NotFound} />
            </Switch>
          {/* </Grid>
        </Grid>
      </div> */}
    </Router>
  )
}

export default Content