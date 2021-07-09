import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Pages
import Login from './Pages/Auth/Login'
import Content from './Pages/Content/Content'

//styling components
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

// helpers
import { getItem } from './Helpers/LocalStorage/LocalStorage'

// action types
import { SETUSER } from './Reducers/actionTypes'

function App() {

  // keep track of authenticated user
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()

  useEffect(() => {

    let refreshToken = getItem('usertoken')
    let email = getItem('email')
    let uid = getItem('uid')

    // verify this first
    if (refreshToken && email && uid) {
      dispatch({
        type: SETUSER,
        token: refreshToken,
        email: email,
        user: uid
      })
    }

  })

  return (
    <>
      <ReactNotification />
      {
        !user ? (
          <Login/>
        ) : (
          <>
            <Content />
          </>
        )
      }
    </>
  );
}

export default App;
