import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useHistory } from "react-router-dom"
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import LockOpen from '@material-ui/icons/LockOpen'

import './CSS/common.css'

// components
import Notification from '../../Components/Notification/Notification'
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'
import Illustration from '../Static/Illustration'

// helpers
import post from '../../Helpers/Request/post'

function Register() {
    let history = useHistory()

    let moveToLogin = () => {
        history.push("/")
    }

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [cpassword, setcPassword] = useState(null)

    let handleRegister = async (event) => {
        event.preventDefault()

        showLoadingScreen()

        if (!email || !password || !cpassword) {
            Notification('Warning', 'Please fill all the field to proceed!!', "danger")
            return
        } 

        const response = await post('register', {
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
                        <Illustration/>
                    </div>
                    <div class="col-md-6 col-12 input-position text-center">
                        <Form onSubmit={handleRegister} id="commonform">
                            <h2 style={{ textAlign: "center" }}><LockOpen /> Register</h2>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <TextField label="Email" type="email" fullWidth color="primary"
                                    onChange={(event) => setEmail(event.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <TextField label="Password" type="password" fullWidth color="primary"
                                    onChange={(event) => setPassword(event.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <TextField label="Confirm Password" type="password" fullWidth color="primary"
                                   onChange={(event) => setcPassword(event.target.value)}/>
                            </Form.Group>
                            <Button variant="contained" color="primary" type="submit">
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
