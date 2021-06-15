import React,{ useState } from 'react'
import Loader from './CallScreenSheet'
import useSound from 'use-sound';

//sound
import tringtring from '../../Assests/Ringtone/tring_tring.mp3'

function CallScreen() {
    const [loading, setLoading] = useState(false)

    // play audio sound
    const [play] = useSound(tringtring, { volume: 0.25 })
    
    return (
        [
            (loading)?(
                <>
                    <Loader/>
                    {play}
                </>
            ):null,
            ()=>setLoading(true),
            ()=>setLoading(false)
        ]
    )
}

export default CallScreen
