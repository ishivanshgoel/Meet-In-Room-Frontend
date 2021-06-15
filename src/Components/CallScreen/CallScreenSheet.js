import React from 'react'
import { Loader, Segment, Dimmer } from 'semantic-ui-react'


function CallScreenSheet() {
    
    return (
        <Segment style={{height: "100vh", width: "100%" }}>
            <Dimmer active>
                <Loader content='Calling...' />
            </Dimmer>
        </Segment>
    )
}

export default CallScreenSheet