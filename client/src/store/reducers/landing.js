import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from "../../shared/utility";

const initialState = {
    tournamentsArray: [],
    fetchMode: false,
    createMode: false
};


const setTournaments = (state, action) => {
    console.log('on fetch now');
    return updateObject(state, {tournamentsArray: action.tournamentsArray,
        fetchMode: true,
        createMode: false
    });
};

const landing = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TOURNAMENTS: return setTournaments(state, action);
        default:
            return state;
    }
};

export default landing;
