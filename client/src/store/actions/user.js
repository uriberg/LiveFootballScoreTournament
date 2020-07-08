import axiosInstance from "../../axios";
import * as actionTypes from "./actionsTypes";
import {DEBUG} from "../../constants/settings";

export const login = (name, id) => {
    return dispatch => {
        return axiosInstance().get('/users/' + id)
            .then(response => {
                DEBUG && console.log(response);
                if (response.data === null){
                    DEBUG && console.log('user is null');
                    DEBUG && console.log(id);
                    dispatch(addUser(name, id));
                } else {
                    let responseName = response.data.name;
                    let responseId = response.data._id;
                    dispatch(setCurrUser(responseName, responseId));
                }

            })
            .catch(error => {
                DEBUG && console.log(error)
            });
    };
};

export const logout = () => {
    return {
        type: actionTypes.LOGOUT
    }
};

export const setCurrUser = (name, id) => {
    return {
        type: actionTypes.LOGIN,
        currUserName: name,
        currUserId: id
    };
};

export const addUser = (name, id) => {
    return dispatch => {
        return axiosInstance().post('/users/addUser', {name: name, id: id})
            .then(response => {
                DEBUG && console.log(response);
                let responseName = response.data.name;
                let responseId = response.data._id;
                dispatch(setCurrUser(responseName, responseId));
            })
            .catch(error => {
                DEBUG && console.log(error)
            });
    };
};
