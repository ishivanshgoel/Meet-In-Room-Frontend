import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import post from '../../Helpers/Request/post'

// compoents
import Card from '../../Components/RoomCard/RoomCard'

function Meet() {

    const user = useSelector((state)=> state.user)
    const [fetched, setFetched] = useState(false)
    const [rooms, setRooms] = useState([])

    useEffect(async()=>{
        const myRooms = await post('myrooms',{
            myId: user
        })
        setRooms(myRooms.data)
        console.log(myRooms.data)
        setFetched(true)
        
    },[])

    return (
        <div id="meet-container">
            {
                fetched ? (
                    rooms && rooms.length > 0 ? (
                        rooms.map((room)=>
                            <Card roomId={room}/>
                        )
                    ) : (
                        <h1> No Rooms Found </h1>
                    )
                ):(
                    <h1>Fetching Rooms</h1>
                )
            }
        </div>
    )
}

export default Meet
