import { SETUSER, REMOVEUSER } from './actionTypes' 

// initial state
const initialState = {
    user: false,
    admin: false
};

// action reducer
function userReducers(state = initialState, action) {
    switch(action.type) {
        case SETUSER:
           
            return {
                ...state,
                user: action.token,
                username: action.username,
                id: action.id
            }
        case REMOVEUSER:
            
            return {
                ...state,
                user: false,
                username: false,
                id: false
            }
    default:
       return state;
    }
}

export default userReducers 