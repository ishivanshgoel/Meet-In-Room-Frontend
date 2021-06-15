import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

// Pages
import Call from '../Call/Call'
import Chat from '../Chat/Chat'
import Teams from '../Teams/Teams'
import NotFound from '../../Pages/Static/NotFound'

//styling
import './CSS/content.css'
import { Icon } from 'semantic-ui-react'

// routes
const routes = [
    { path: 'call', component: Call, name: 'call' },
    { path: 'chat', component: Chat, name: 'chat' },
    { path: 'teams', component: Teams, name: 'users' },
  ]
  

function Content() {
    return (
        <Router>
        {/* fixed sidebar */}
        <div class="main">
          <div class="sidenav">
            {
              routes.map((route) => {
                return <Link to={route.path} class="sidenav-icons"><Icon name={route.name} /></Link>
              })
            }
          </div>

          {/* main div*/}
          <Switch>
            {
              routes.map((route) => {
                return (<Route exact path={"/" + route.path} component={route.component} />)
              })
            }
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    )
}

export default Content
