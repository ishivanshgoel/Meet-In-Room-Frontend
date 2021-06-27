import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import post from '../../Helpers/Request/post'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import TeamCards from './TeamCards'
import { Modal, Form } from 'react-bootstrap'
import Button from '@material-ui/core/Button'

// compoents
import Notification from '../../Components/Notification/Notification'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

}));


function Meet() {


    const classes = useStyles();

    const user = useSelector((state) => state.user)
    const [rooms, setRooms] = useState([])

    useEffect(async () => {
        
        const myRooms = await post('myrooms', {
            myId: user
        })
        console.log(myRooms.data)
        setRooms(myRooms.data)

    }, [])



    // ################## create team model ##################
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [teamName, setTeamName] = useState(null)
    const handleCreateTeam = async (event) => {
        console.log(teamName)
        const response = await post('createroom', {
            myId: user,
            name: teamName
        })
        console.log(response)
        if (response.data) {
            console.log(response.data)
            setRooms([
                ... rooms,
                response.data
            ])
            Notification('Success', 'New Team Created', 'success')
        } else {
            Notification('Error', 'Cannot create this team', 'warning')
        }
    }
    // ################## create team model ends ##################

    return (
        <Paper className={classes.paper}>
            <Button variant="contained" color="primary" onClick={handleShow}>
                New Team
            </Button>

            {/* new team modal */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control type="text" placeholder="team name" onChange={(event) => setTeamName(event.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateTeam}>Create</Button>
                </Modal.Footer>
            </Modal>
            {/* new team modal ends */}
            
            {
                rooms && <TeamCards rooms={rooms} />
            }
        </Paper>
    )
}

export default Meet
