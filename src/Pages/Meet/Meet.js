import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TeamCards from './TeamCards'
import { Modal, Form } from 'react-bootstrap'
import Button from '@material-ui/core/Button'
import Create from '@material-ui/icons/Create'

// compoents
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'
import Notification from '../../Components/Notification/Notification'
import Illustration from '../Static/Illustration'

// helpers
import post from '../../Helpers/Request/post'

function Meet() {


    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()

    const user = useSelector((state) => state.user)
    const [rooms, setRooms] = useState([])

    useEffect(async () => {
        showLoadingScreen()
        const myRooms = await post('myrooms', {
            myId: user
        })
        console.log(myRooms.data)
        setRooms(myRooms.data)
        hideLoadingScreen()
    }, [])



    // ################## create-team model ##################
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [teamName, setTeamName] = useState(null)
    const handleCreateTeam = async (event) => {
        
        if(!teamName || teamName.length<2){
            Notification('Warning', 'Team Name length cannot be less than 2', 'warning')
            return
        }
        else if (teamName.length>10){
            Notification('Warning', 'Team Name length cannot exceed 10', 'warning')
            return
        }

        const response = await post('createroom', {
            myId: user,
            name: teamName,
            owner: user
        })
        console.log(response)
        if (response.data) {
            console.log(response.data)
            setRooms([
                ...rooms,
                response.data
            ])
            Notification('Success', 'New Team Created', 'success')
        } else {
            Notification('Error', 'Cannot create this team', 'warning')
        }
    }
    // ################## create-team model ends ##################

    return (
        <div>
            {loadingScreen}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginRight: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleShow}>
                    <Create /> <span style={{ margin: '10px' }}>New Team</span>
                </Button>
            </div>

            {/* new team modal */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    New Team
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control type="text" placeholder="Team Name" onChange={(event) => setTeamName(event.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" color="primary" onClick={handleClose} style={{margin:"10px"}}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCreateTeam}>Create</Button>
                </Modal.Footer>
            </Modal>
            {/* new team modal ends */}

            {
                rooms ? 
                    (rooms.length > 0 ? (<TeamCards rooms={rooms} />) : (null)) :
                    (<Illustration text='You are not added to any Team yet!! Create One to start!!' />) // if not able to fetch the rooms
            }
        </div>
    )
}

export default Meet
