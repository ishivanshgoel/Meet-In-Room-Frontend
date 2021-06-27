import React, { useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'
import { useHistory } from "react-router-dom"

import './CSS/common.css'

// components
import Notification from '../../Components/Notification/Notification'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'

// services
import post from '../../Helpers/Request/post'

function Register() {
    let history = useHistory()

    let moveToLogin = () => {
        history.push("/")
    }

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [cpassword, setcPassword] = useState(null)

    let handleRegister = async (event) => {
        event.preventDefault()

        showLoadingScreen()

        if (!name || !email || !password || !cpassword) {
            Notification('Warning', 'Please fill all the field to proceed!!', "danger")
            return
        } 

        const response = await post('register', {
            name,
            email,
            password
        })

        if (response.data) {

            // de-structure the object to get data out of it 
            let { data } = response.data

            // set user in redux store
            // dispatch({
            //     type: SETUSER,
            //     token: data.refreshData,
            //     username: email,
            //     user: data.uid
            // })

            // if registered successfully
            Notification('Voila!', 'You are registered Successfully!!', "success")

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
                        <Form onSubmit={handleRegister} id="commonform">
                            <h2 style={{ textAlign: "center" }}>Register</h2>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="Name" onChange={(event) => setName(event.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Confirm Password" onChange={(event) => setcPassword(event.target.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Register
                            </Button>
                            <Button variant="link" onClick={moveToLogin}>Already Registered? Click Here</Button>
                            <br></br>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
