import React from 'react'
import { Segment, Dimmer } from 'semantic-ui-react'

function NotFound() {
    return (
        <Segment style={{height: "100vh", width: "100%" }}>
            <Dimmer active inverted>
                <h1 style={{color:"black"}}>Page Not Found</h1>
            </Dimmer>
        </Segment>
    )
}

export default NotFound
