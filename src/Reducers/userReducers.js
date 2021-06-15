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
                email: action.email,
                user: action.user
            }
        case REMOVEUSER:
            
            return {
                ...state,
                email: false,
                user: false,
            }
    default:
       return state;
    }
}

export default userReducers 