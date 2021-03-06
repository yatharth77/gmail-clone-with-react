import { ADD_ACCESS_TOKEN, SET_USER_SIGNED_IN, SET_HISTORT_ID, SET_LABEL } from "../constants/action-types";

const initialState = {
    accessToken: "",
    signedIn: false,
    historyId: "",
    label: "INBOX",
};
  
function rootReducer(state = initialState, action) {
    if (action.type === ADD_ACCESS_TOKEN) {
        return Object.assign({}, state, {
            accessToken: action.payload
        })
    }
    else if(action.type === SET_USER_SIGNED_IN){
        return Object.assign({}, state, {
            signedIn: action.payload
        })
    }
    else if(action.type === SET_HISTORT_ID){
        return Object.assign({}, state, {
            historyId: action.payload
        })
    }
    else if(action.type === SET_LABEL){
        return Object.assign({}, state, {
            label: action.payload
        })
    }
    return state;
};

export default rootReducer;