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

// styling
import { Button, Form, Card } from 'react-bootstrap'

// services
import get from '../../Services/Request/get'
import post from '../../Services/Request/post'


function _Login() {
    let history = useHistory()

    let moveToRegister = () => {
        history.push("/register")
    }

    const dispatch = useDispatch()

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    let handleFormSubmit = (event)=>{
        // login request
        event.preventDefault()

        if(!email || !password){
            Notification('Warning','Please type something to proceed!!', "danger")
            return
        }

        // set user in store
        dispatch({
            type: SETUSER,
            token: password,
            username: email,
            id: 23
        })
    }

    return (
        <Card style={{ margin: "40px", border: "1px solid black" }}>
            <Card.Header as="h5">Sign In</Card.Header>
            <Card.Body>
                <Form style={{ padding: "50px" }} onSubmit={handleFormSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>

                        <Form.Control type="email" placeholder="Enter email" 
                            onChange={(event)=>setEmail(event.target.value)}/>
                    
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" 
                        onChange={(event)=>setPassword(event.target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="link" onClick={moveToRegister}>New User? Register Here</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

function Login() {
    return (
        <Router>
            <Switch>
                <Route exact path="/"><_Login/></Route>
                <Route exact path="/register"><Register/></Route> 
                {/* Not found */}
                <Route component={NotFound}/>
            </Switch>
        </Router>
    )
}

export default Login
