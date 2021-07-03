import { SETUSER, 
        REMOVEUSER, 
        CALLACCEPTED, 
        SETPEER, 
        SETSTREAM, 
        MEETINGPARTICIPANTS,
        REMOVEPARTICIPANT,
        SETMESSAGE 
    } 
from './actionTypes' 

// initial state
const initialState = {
    user: false,
    meetingParticipants: [],
    messages: []
};

// action reducer
function userReducers(state = initialState, action) {
    switch(action.type) {
        case SETUSER:
           
            return {
                ...state,
                email: action.email,
                user: action.user,
                token: action.token
            }
        case REMOVEUSER:
            
            return {
                ...state,
                email: false,
                user: false,
            }
        case CALLACCEPTED:
            return {
                ...state,
                callaccepted: true
            }
        
        case SETPEER:
            return {
                ...state,
                peerId: action.peerId
            }
        
        case SETSTREAM:
            return {
                ... state,
                stream: action.stream
            }

        case SETSTREAM:
            return {
                ... state,
                stream: action.stream
            }
        
        case MEETINGPARTICIPANTS:
            console.log("Add new participant ", action.newParticipant)
            return {
                ...state,
                meetingParticipants: [
                    ... state.meetingParticipants,
                    action.newParticipant
                ]
            }
        
        case REMOVEPARTICIPANT:
            let allParticipants = state.meetingParticipants
            if(allParticipants){
                allParticipants = allParticipants
                                    .filter(e => e !== action.removeParticipant)
            }
            return {
                ...state,
                meetingParticipants: allParticipants
            }

        case SETMESSAGE:
            console.log("New Message ", action.newMessage)
            return {
                ...state,
                messages: [
                    ... state.messages,
                    action.newMessage
                ]
            }
    default:
       return state;
    }
}

export default userReducers 