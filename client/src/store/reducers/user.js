import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from "../../shared/utility";

const initialState = {
    currUserName: '',
    currUserId: ''
};

const login = (state, action) => {
    return updateObject(state, {
        currUserName: action.currUserName,
        currUserId: action.currUserId
    });
};

const logout = (state, action) => {
    return updateObject(state, {
        currUserName: '',
        currUserId: ''
    });
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return login(state, action);
        case actionTypes.LOGOUT:
            return logout(state, action);
        default:
            return state;
    }
};

export default user;
