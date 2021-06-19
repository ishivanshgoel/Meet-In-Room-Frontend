import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Pages
import Login from './Pages/Auth/Login'
import Content from './Pages/Content/Content'

//styling components
import 'semantic-ui-css/semantic.min.css'
import LoadingScreen from './Components/LoadingScreen/LoadingScreenHook'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import {getItem} from './Helpers/LocalStorage/LocalStorage'
import {SETUSER} from './Reducers/actionTypes'

function App() {
  // loading screen
  const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()

  // keep track of authenticated user
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  useEffect(()=>{

    let refreshToken = getItem('usertoken')
    let email = getItem('email')
    let uid = getItem('uid')

    // verify this first
    if(refreshToken && email && uid){
        dispatch({
          type: SETUSER,
          token: refreshToken,
          email: email,
          user: uid
      })
    }
  
  }) 
  // reciever() 

  return (
    <>
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
        </div>
      </nav>
      <ReactNotification />
      {
        ! user ? (
          <Login/>
        ) : (
          <Content />
        )
      }
    </>
  );
}

export default App;
