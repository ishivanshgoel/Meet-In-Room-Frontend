import React from 'react'
import { useHistory } from 'react-router'
import { Button, Card, Image } from 'semantic-ui-react'


function RoomCard({ name, roomId, type }) {

    let history = useHistory()

    let handleJoinRoom = (event) => {
        history.push(`/team/${event.target.name}`)
    }

    return (
        <Card.Group style={{ margin: "30px" }}>
            <Card>
                <Card.Content>
                    <Image
                        floated='right'
                        size='mini'
                        src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                    />
                    <Card.Header>{name}</Card.Header>
                </Card.Content>
                <Card.Content>
                    <Button basic color='green' onClick={handleJoinRoom} name={roomId}>
                        Join Room
                    </Button>
                    {
                        type=='owner'?(
                            <Button basic color='green' onClick={()=>history.push(`/team/${roomId}/add`)} name={roomId}>
                                Add People
                            </Button>
                        ):(null)    
                    }
                </Card.Content>
            </Card>
        </Card.Group>
    )
}

export default RoomCard
