import React from 'react'
import { Segment, Dimmer } from 'semantic-ui-react'

function Welcome() {
    return (
        <Segment style={{height: "100vh", width: "100%" }}>
            <Dimmer active inverted>
                <h1 style={{color:"black"}}>Welcome to MS Teams</h1>
            </Dimmer>
        </Segment>
    )
}

export default Welcome
