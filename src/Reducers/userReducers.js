import { SETUSER, 
        REMOVEUSER, 
        MEETINGPARTICIPANTS,
        REMOVEPARTICIPANT,
        SETMESSAGE, 
        SETMESSAGES
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
        
        case MEETINGPARTICIPANTS:
            console.log("Add new participant ", action.newParticipant)
            let allParticipants = state.meetingParticipants
            let output = allParticipants.find(p => p === action.newParticipant)
            if(!output){
                return {
                    ...state,
                    meetingParticipants: [
                        ... state.meetingParticipants,
                        action.newParticipant
                    ]
                }
            } else{
                return{
                    ... state
                }
            }
        
        case REMOVEPARTICIPANT:
            let allParticipant = state.meetingParticipants
            if(allParticipant){
                allParticipant = allParticipant
                                    .filter(e => e !== action.removeParticipant)
            }
            return {
                ...state,
                meetingParticipants: allParticipant
            }
        
        case SETMESSAGES:
            return {
                ...state,
                messages: action.allMessages
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