import './App.css';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// Pages
import Login from './Pages/Auth/Login'
import Content from './Pages/Content/Content'


//styling components
import 'semantic-ui-css/semantic.min.css'
import LoadingScreen from './Components/LoadingScreen/LoadingScreenHook'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

//services
import online from './Services/Socket/Status/online'
import reciever from './Services/Socket/Call/reciever'

function App() {
  // loading screen
  const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()

  useEffect(()=>{
    // pass the user id
    // let id = prompt()
    let id = 'shivansh'
    online(id)
    
     // listeing to incoming calls
    reciever()

    showLoadingScreen()

  })  

  // keep track of authenticated user
  const user = useSelector(state => state.user)

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
