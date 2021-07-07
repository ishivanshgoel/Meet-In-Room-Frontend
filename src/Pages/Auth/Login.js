import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { SETUSER } from '../../Reducers/actionTypes'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MeetingRoom from '@material-ui/icons/MeetingRoom'
import LockOpen from '@material-ui/icons/LockOpen'
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedIn from '@material-ui/icons/LinkedIn'

// pages
import Register from './Register'
import NotFound from '../Static/NotFound'

// compoenents
import Notification from '../../Components/Notification/Notification'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'
import Illustration from '../Static/Illustration'

// styling
import { Form, Card } from 'react-bootstrap'
import './CSS/common.css'

// services
import post from '../../Helpers/Request/post'
import { setItem } from '../../Helpers/LocalStorage/LocalStorage'

/**
 * @param _Login login form
 * @param loadingScreen loading scrren hook variable
 * @param email email entered by user in input field
 * @param password password entered by user in input field
 */

function _Login() {
    let history = useHistory()

    let moveToRegister = () => {
        history.push("/register")
    }

    const dispatch = useDispatch()

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    let handleFormSubmit = async (event) => {
        // login request
        event.preventDefault()

        showLoadingScreen()

        if (!email || !password) {
            Notification('Warning', 'Please type something to proceed!!', "danger")
            return
        }

        const response = await post('login', {
            email,
            password
        })

        if (response.data) {
            let { data } = response
            let { uid, refreshToken } = data
            // set user in redux store
            dispatch({
                type: SETUSER,
                token: refreshToken,
                email: email,
                user: uid
            })
            setItem('usertoken', refreshToken)
            setItem('email', email)
            setItem('uid', uid)
        } else {
            // response is error message : string
            Notification('Error', response, 'danger')
        }

        hideLoadingScreen()

    }

    return (
        <>
            {loadingScreen}
            <div class="container">
                <div class="row">
                    <div class="col-md-6 col-12 commontext">
                        <Illustration />
                    </div>
                    <div class="col-md-6 col-12 input-position text-center">
                        <Form onSubmit={handleFormSubmit} id="commonform">
                            <h2 style={{ textAlign: "center" }}><LockOpen /> Login</h2>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <TextField label="Email" type="email" fullWidth color="primary"
                                    onChange={(event) => setEmail(event.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <TextField label="Password" type="password" fullWidth color="primary"
                                    onChange={(event) => setPassword(event.target.value)} />
                            </Form.Group>
                            <Button variant="contained" color="primary" type="submit">
                                Login
                            </Button>
                            <Button variant="link" onClick={moveToRegister}>New User? Register Here</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function Login() {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MeetingRoom />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Meet - In - Room
                    </Typography>
                </Toolbar>
            </AppBar>
            <Router>
                <Switch>
                    <Route exact path="/"><_Login /></Route>
                    <Route exact path="/register"><Register /></Route>
                    {/* Not found */}
                    <Route component={NotFound} />
                </Switch>
            </Router>
            <div className="footer-common">
                <div className="footer-common-heading">
                    <p>Buit with ❤️ by Shivansh Goel</p>
                </div>
                <div className="footer-common-icons">
                    <div className="footer-common-icons-item"><a target="_blank" href="https://github.com/ishivanshgoel"><GitHubIcon/></a></div>
                    <div className="footer-common-icons-item"><a target="_blank" href="https://www.linkedin.com/in/shivansh-goel-260019a7/"><LinkedIn/></a></div>
                </div>
            </div>
        </div>

    )
}

export default Login
