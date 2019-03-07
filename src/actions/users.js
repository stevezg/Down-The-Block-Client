import {SubmissionError} from 'redux-form';
import {API_BASE_URL} from '../config';
import { normalizeResponseErrors } from './utils';
import { refreshProfileAuthToken, authError, login } from './auth';
import { UPDATED_USER_SUCCESS, CHANGE_SUCCESS_MESSAGE, FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_ERROR } from './types';
import {
  USER_COORDS_REQUEST,
  USER_COORDS_SUCCESS,
  USER_COORDS_ERROR
} from './types';

export const registerUser = user => dispatch => {
    let password = user.password;
    let formData = new FormData();

    Object.keys(user).forEach(item=> {
        formData.append(item, (user[item]))
    });

    return fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: formData
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((user) => dispatch(login(user.username, password)))
        .catch(err => {
            const {location, message, status } = err;
            const str =
                status === 422 && location==='registerUsername'
                ? message
                : 'Unable to register, please try again';
            dispatch(authError(err));
            // Could not authenticate, so return a SubmissionError for Redux
            // Form
            return Promise.reject(
                new SubmissionError({
                    [location]: str,
                    _error: str
                })
            );
        });
};

export const updatedUserSuccess = (updatedUser, message) => ({
    type: UPDATED_USER_SUCCESS,
    updatedUser,
    message
})

export const changeSuccessMessage = (message) =>({
    type: CHANGE_SUCCESS_MESSAGE,
    message
})

export const updatedUser = user => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    return fetch(`${API_BASE_URL}/users/account`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(user)
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(updatedUser => {
            dispatch(updatedUserSuccess(updatedUser, 'Your account has been successfully updated'));
        })
        .then(()=>{
            dispatch(refreshProfileAuthToken())
        })
        .catch(err => {
            const { location, message} = err;
            const str = location==="username" ? message : 'Unable to update, please try again';
            // Could not authenticate, so return a SubmissionError for Redux
            // Form
            return Promise.reject(
                new SubmissionError({
                    [location]: str,
                    _error: str
                })
            );
        });
};

export const updatePassword = user => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    return fetch(`${API_BASE_URL}/users/password`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(user)
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(updatedUser => {
            dispatch(updatedUserSuccess(updatedUser, 'Your password has been successfully updated'));
        })
        .catch(err => {
            const {location } = err;
            const message = 'Unable to update, please try again';
            // Could not authenticate, so return a SubmissionError for Redux
            // Form
            return Promise.reject(
                new SubmissionError({
                    [location]: message,
                    _error: message
                })
            );
        });
};

export const updateProfilePhoto = photo => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    let formData = new FormData();

    formData.append('photo', photo)


    return fetch(`${API_BASE_URL}/users/photo`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${authToken}`
        },
        body: formData
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(updatedUser => {
            dispatch(updatedUserSuccess(updatedUser, 'Your account has been successfully updated'));
        })
        .then(()=>{
            dispatch(refreshProfileAuthToken())
        })

        .catch(err => {
            //add error handling
        });
};

export const fetchUsersRequest = () => ({
    type: FETCH_USERS_REQUEST,
})

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USERS_SUCCESS,
  users
})

export const fetchUsersError= (error) => ({
  type: FETCH_USERS_ERROR,
  error
})

export const fetchUsers = (coords) => (dispatch, getState) => {
    dispatch(fetchUsersRequest());
    const authToken = getState().auth.authToken;
    let simplifiedGeoObject = {
        latitude: coords.latitude,
        longitude: coords.longitude
      }
      let stringifiedObj = JSON.stringify(simplifiedGeoObject);
    fetch(`${API_BASE_URL}/users/${stringifiedObj}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(users => {
            dispatch(fetchUsersSuccess(users));
        })
        .catch(error => {
            //add error handling
        });
};
export const userCoordsRequest = () => ({
    type: USER_COORDS_REQUEST
});

export const userCoordsSuccess = user => ({
    type: USER_COORDS_SUCCESS,
    user
});

export const userCoordsError = error => ({
    type: USER_COORDS_ERROR,
    error
})

export const setUserCoords = (coords) => (dispatch, getState) => {
    dispatch(userCoordsRequest());
    const authToken = getState().auth.authToken;

    let simplifiedGeoObject = {
        latitude: coords.latitude,
        longitude: coords.longitude,
    };

    if (coords.automatic === false){
        simplifiedGeoObject.automatic = false;
    } else {
        simplifiedGeoObject.automatic = true
    }

    let stringifiedObj = JSON.stringify(simplifiedGeoObject);

    const path = `${API_BASE_URL}/users/location/${stringifiedObj}`; 

    return fetch(path, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
        },
    })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(user => {
        dispatch(userCoordsSuccess(user));
    })
    .then(()=>{
        dispatch(refreshProfileAuthToken())
    })
    .catch(error => {
        dispatch(userCoordsError(error))
    })
}
