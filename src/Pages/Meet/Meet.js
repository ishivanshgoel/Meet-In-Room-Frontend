import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import post from '../../Helpers/Request/post'

// compoents
import Card from '../../Components/RoomCard/RoomCard'
import LoadingScreenHook from '../../Components/LoadingScreen/LoadingScreenHook'

function Meet() {

    const user = useSelector((state) => state.user)
    const [fetched, setFetched] = useState(false)
    const [rooms, setRooms] = useState([])

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreenHook()

    useEffect(async () => {
        showLoadingScreen()
        const myRooms = await post('myrooms', {
            myId: user
        })
        setRooms(myRooms.data)
        setFetched(true)
        hideLoadingScreen()
    }, [])

    return (
        <div id="meet-container">
            {
                fetched ? (
                    rooms && rooms.length > 0 ? (
                        rooms.map((room) =>
                            <Card roomId={room} />
                        )
                    ) : (
                        <h1> No Rooms Found </h1>
                    )
                ) : (
                    <>
                        {loadingScreen}
                    </>
                )
            }
        </div>
    )
}

export default Meet
