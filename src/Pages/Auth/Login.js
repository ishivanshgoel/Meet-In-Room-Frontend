import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { SETUSER } from '../../Reducers/actionTypes'

// pages
import Register from './Register'
import NotFound from '../Static/NotFound'

// compoenents
import Notification from '../../Components/Notification/Notification'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'

// styling
import { Button, Form, Card } from 'react-bootstrap'
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
                    </div>
                    <div class="col-md-6 col-12 input-position text-center">
                        <Form onSubmit={handleFormSubmit} id="commonform">
                            <h2 style={{ textAlign: "center" }}>Login</h2>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Enter email"
                                    onChange={(event) => setEmail(event.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">

                                <Form.Control type="password" placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
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

function Login() {
    return (
        <Router>
            <Switch>
                <Route exact path="/"><_Login /></Route>
                <Route exact path="/register"><Register /></Route>
                {/* Not found */}
                <Route component={NotFound} />
            </Switch>
        </Router>
    )
}

export default Login
