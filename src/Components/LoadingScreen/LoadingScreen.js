import React from 'react'
import { Loader, Segment, Dimmer } from 'semantic-ui-react'

function LoadingScreen() {
    return (
        <Segment style={{height: "100vh", width: "100%" }}>
            <Dimmer active>
                <Loader content='Loading' />
            </Dimmer>
        </Segment>
    )
}

export default LoadingScreen
