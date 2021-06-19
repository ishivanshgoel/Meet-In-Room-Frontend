import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
// import { peer } from '../../Services/Socket/Call/listner'

// Pages
import Contacts from '../Contacts/Contacts'
import NotFound from '../../Pages/Static/NotFound'
import Welcome from '../../Pages/Static/Welcome'
import Meet from '../../Pages/Meet/Meet'
import JoinRoom from '../Meet/JoinRoom'
import JoinMeet from '../Meet/JoinMeet'

//styling
import './CSS/content.css'
import { Icon } from 'semantic-ui-react'

//services
// import online from '../../Services/Socket/Status/online'
// import {init} from '../../Services/Socket/Call/listner'
import {initPeer} from '../../Configuration/peer'



/**
 * @param routes array of all the routes in application
 * @param user user-id stored in redux store
 */

// routes
const routes = [
    { path: 'contacts', component: Contacts, name: 'contacts' },
    { path: 'meet', component: Meet, name: 'meet' },
    // { path: 'call', component: Call, name: 'call' },
  ]

function Content() {

  const user = useSelector(state => state.user)
  const remoteVideo = useRef()

    useEffect(()=>{

      // emit event to join user in the room at server
      // online(user)
      initPeer(user)
      // listening for incoming calls
      // listner(user)

      // peer.on('call', (call) => {
      //   console.log('Got call')
        
      //   navigator.mediaDevices.getUserMedia({
      //       audio: true,
      //       video: true
      //   }).then((stream) => {

      //       call.answer(stream)
      //       call.on('stream', (remoteStream) => {
      //           // const video = document.createElement('video')
      //           remoteVideo.current.srcObject = remoteStream

      //           console.log('Getting remote stream')
      //       })
      //   }).catch((error)=>{
      //       console.log("Error in stream ", error)
      //   })
    // })

    },[])

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
          <div id='videoRoot'>
            {/* {videoGrid} */}
          </div>

          {/* main div*/}
          <Switch>
            <Route exact path="/" component={Welcome} />
            {
              routes.map((route) => {
                return (<Route 
                  exact 
                  path={"/" + route.path} 
                  component={route.component}
                  remoteVideo={remoteVideo}/>)
              })
            }
            <Route exact path="/meet/:id" component={JoinRoom} />
            <Route exact path="/meet/:id/join" component={JoinMeet} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <script src="../../Services/Socket/Call/listner"></script>
      </Router>
    )
}

export default Content