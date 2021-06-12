import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

// components
import Call from './Components/Call/Call'
import Chat from './Components/Chat/Chat'
import Teams from './Components/Teams/Teams'

//styling
import { Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

// routes
const routes = [
  { path: 'call', component: Call, name: 'call' },
  { path: 'chat', component: Chat, name: 'chat' },
  { path: 'teams', component: Teams, name: 'users' },
]

function App() {
  return (
    <>
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Navbar</a>
        </div>
      </nav>

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
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
