import React from 'react'
import { useHistory } from 'react-router'
import { Button, Card, Image } from 'semantic-ui-react'

function RoomCard({ name, roomId }) {

    let history = useHistory()

    let handleJoinRoom = (event)=>{
        history.push(`/meet/${event.target.name}`)
    }

    return (
        <Card.Group style={{margin:"30px"}}>
            <Card>
                <Card.Content>
                    <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                    />
                    <Card.Header>{roomId}</Card.Header>
                    {/* <Card.Description>
          Steve wants to add you to the group <strong>best friends</strong>
        </Card.Description> */}
                </Card.Content>
                <Card.Content extra>
                    <div className='ui one button'>
                        <Button basic color='green' onClick={handleJoinRoom} name={roomId}>
                            Join Room
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        </Card.Group>
    )
}

export default RoomCard
