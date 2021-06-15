import React,{ useState } from 'react'
import Loader from './LoadingScreen'

function LoadingScreenHook() {
    const [loading, setLoading] = useState(false)

    return (
        [
            (loading)?(
                <Loader/>
            ):null,
            ()=>setLoading(true),
            ()=>setLoading(false)
        ]
    )
}

export default LoadingScreenHook
