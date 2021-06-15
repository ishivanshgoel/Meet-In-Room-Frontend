import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"

// Pages
import Call from '../Call/Call'
import Chat from '../Chat/Chat'
import Teams from '../Teams/Teams'
import NotFound from '../../Pages/Static/NotFound'
import Welcome from '../../Pages/Static/Welcome'

//styling
import './CSS/content.css'
import { Icon } from 'semantic-ui-react'

//services
import reciever from '../../Services/Socket/Call/reciever'
import online from '../../Services/Socket/Status/online'

// routes
const routes = [
    { path: 'call', component: Call, name: 'call' },
    { path: 'chat', component: Chat, name: 'chat' },
    { path: 'teams', component: Teams, name: 'users' },
  ]
  

function Content() {

    useEffect(()=>{

      // emit event to join user in the room at server
      online()
      
      // listening for incoming calls
      reciever()
    })

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
            <Route exact path="/" component={Welcome} />
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
