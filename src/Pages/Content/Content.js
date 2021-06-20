import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import { initPeer } from '../../Configuration/peer'

// Pages
import Chat from '../Chat/Chat'
import NotFound from '../../Pages/Static/NotFound'
import Welcome from '../../Pages/Static/Welcome'
import Meet from '../../Pages/Meet/Meet'
import JoinRoom from '../Meet/JoinRoom'
import JoinMeet from '../Meet/JoinMeet'

//styling
import { Icon } from 'semantic-ui-react'

/**
 * @param routes array of all the routes in application
 * @param user user-id stored in redux store
 */

// routes
const routes = [
  { path: 'chat', component: Chat, name: 'Chat' },
  { path: 'meet', component: Meet, name: 'Teams' },
]

function Content() {

  const user = useSelector(state => state.user)

  useEffect(() => {
    // initialize peer connection
    initPeer(user)
  }, [])

  return (
    <Router>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand">Chat App</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              {
                routes.map((route) => {
                  return (
                    <li class="nav-item">
                      <Link to={route.path} className="sidenav-icons"><Icon name={route.name} />{route.name}</Link>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </nav>
      <div class="row">
          <Switch>
            <Route exact path="/" component={Welcome} />
            {
              routes.map((route) => {
                return (<Route
                  exact
                  path={"/" + route.path}
                  component={route.component}
                  />)
              })
            }
            <Route exact path="/meet/:id" component={JoinRoom} />
            <Route exact path="/meet/:id/join" component={JoinMeet} />
            <Route component={NotFound} />
          </Switch>
        </div>
    </Router>
  )
}

export default Content