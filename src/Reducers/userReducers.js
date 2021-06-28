import { SETUSER, REMOVEUSER, CALLACCEPTED, SETPEER, SETSTREAM } from './actionTypes' 

// initial state
const initialState = {
    user: false,
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

    default:
       return state;
    }
}

export default userReducers 