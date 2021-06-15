import React, { useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'
import { useHistory } from "react-router-dom"

// components
import Notification from '../../Components/Notification/Notification'

// services
import get from '../../Services/Request/get'
import post from '../../Services/Request/post'

function Register() {
    let history = useHistory()

    let moveToLogin = () => {
        history.push("/")
    }

    const[email, setEmail]=useState(null)
    const[password, setPassword]=useState(null)
    const[cpassword, setcPassword]=useState(null)

    let handleRegister = async (event)=>{
        event.preventDefault();
        if(!email || !password || !cpassword){
            Notification('Warning','Please fill all the field to proceed!!', "danger")
            return
        }

        const response = await post('register',{
            email,
            password
        })

        if(response.data){

            // de-structure the object to get data out of it 
            let { data } = response.data

            // set user in redux store
            // dispatch({
            //     type: SETUSER,
            //     token: data.refreshData,
            //     username: email,
            //     id: data.uid
            // })

            // if registered successfully
            Notification('Voila!','You are registered Successfully!!', "success")

        } else {
            // response is error message : string
            Notification('Error', response, 'danger')
        }

    }


    return (
        <Card style={{margin:"40px", border: "1px solid black"}}>
            <Card.Header as="h5">Sign Up</Card.Header>
            <Card.Body>
                <Form style={{ padding: "50px" }} onSubmit={handleRegister}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email"  onChange={(event)=>setEmail(event.target.value)}/>
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(event)=>setPassword(event.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" onChange={(event)=>setcPassword(event.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="link" onClick={moveToLogin}>Already Registered? Click Here</Button>
                    <br></br>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default Register
