import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { initPeer } from '../../Configuration/peer'

// Pages
import AssignedWork from '../AssignedWork/AssignedWork'
import MyWork from '../MyWork/MyWork'
import Meet from '../Meet/Meet'
import JoinRoom from '../Meet/JoinRoom'
import RoomChat from '../Meet/RoomChat'
import JoinMeet from '../Meet/JoinMeet'
import AddPeople from '../Meet/AddPeople'
import NotFound from '../Static/NotFound'

// components
import Tab from './Tab'

/**
 * @param routes array of all the routes in application
 * @param user user-id stored in redux store
 */

// routes
const routes = [
  { path: '', component: MyWork, name: 'My Work', icon: 'Work'},
  { path: 'assign', component: AssignedWork, name: 'Assign Work', icon: 'Assignment' },
  { path: 'team', component: Meet, name: 'Teams', icon: 'Group' },
]


function Content() {

  const user = useSelector(state => state.user)

  useEffect(() => {
    // initialize peer connection
    initPeer(user)
  }, [])

  return (
    <Router>
      <Tab routes={routes} />
            <Switch>
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
              <Route exact path="/team/:id/add" component={AddPeople} />
              <Route exact path="/team/:id/chat" component={RoomChat} />
              <Route component={NotFound} />
            </Switch>
    </Router>
  )
}

export default Content