import { ADD_ACCESS_TOKEN, SET_USER_SIGNED_IN, SET_ACTIVE_LABEL } from "../constants/action-types";
import { IsetAccessToken, IsetUserSignedIn, IsetActiveLabel} from "../actions/index";

interface IinitialState {
    accessToken: string,
    signedIn: boolean,
    activeLabel: string,
};

const initialState = {
    accessToken: "",
    signedIn: false,
    activeLabel: "INBOX",
};
  
function rootReducer(state: IinitialState = initialState, action: IsetAccessToken | IsetActiveLabel | IsetUserSignedIn ) {
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
    else if(action.type === SET_ACTIVE_LABEL){
        return Object.assign({}, state, {
            activeLabel: action.payload
        })
    }
    return state;
};

export default rootReducer;