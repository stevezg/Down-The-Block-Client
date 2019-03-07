import {
    SET_AUTH_TOKEN,
    CLEAR_AUTH,
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_ERROR,
    UPDATED_USER_SUCCESS,
    CHANGE_SUCCESS_MESSAGE,
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_ERROR,
    USER_COORDS_SUCCESS,
    USER_COORDS_REQUEST,
    USER_COORDS_ERROR,
    FORM_ERROR
} from '../actions/types';

const initialState = {
    authToken: null, // authToken !== null does not mean it has been validated
    currentUser: null,
    loading: false,
    error: null,
    successMessage: null,
    users: [],
    loadingUsers: false,
    formError: null,
};

export default function reducer(state = initialState, action) {
    if (action.type === SET_AUTH_TOKEN) {
        return Object.assign({}, state, {
            authToken: action.authToken
        });
    } else if (action.type === CLEAR_AUTH) {
        return Object.assign({}, state, {
            authToken: null,
            currentUser: null
        });
    } else if (action.type === AUTH_REQUEST) {
        return Object.assign({}, state, {
            loading: true,
            error: null
        });
    } else if (action.type === AUTH_SUCCESS) {
        return Object.assign({}, state, {
            loading: false,
            currentUser: action.currentUser,
            error: null,
        });
    } 
    else if (action.type === AUTH_ERROR) {
        return Object.assign({}, state, {
            loading: false,
            error: action.error
        });
    } 
    else if (action.type === FORM_ERROR) {
        return Object.assign({}, state, {
            loading: false,
            formError: action.formError
        });
    } 
    else if (action.type=== UPDATED_USER_SUCCESS){
        return Object.assign({}, state, {
            currentUser: action.updatedUser,
            successMessage: action.message,
            error: null
        });
    } 
    else if(action.type===CHANGE_SUCCESS_MESSAGE){
        return Object.assign({}, state, {
            successMessage: action.message,
            error: null
        });
    }
    else if(action.type===FETCH_USERS_REQUEST){
      return Object.assign({}, state, {
        loadingUsers: true,
      });
    }
    else if(action.type===FETCH_USERS_SUCCESS){
        return Object.assign({}, state, {
          users: action.users,
          loadingUsers: false,
        });
    }
    else if(action.type===FETCH_USERS_ERROR){
        return Object.assign({}, state, {
            loadingUsers: false,
            error: action.error,
        });
      } 
    else if(action.type === USER_COORDS_REQUEST){
        return Object.assign({}, state, {
            loading: true
        })
    } 
    else if(action.type === USER_COORDS_ERROR){
        return Object.assign({}, state, {
        loading: false,
        error: action.error
        })
    } 
    else if(action.type === USER_COORDS_SUCCESS){
        return Object.assign({}, state, {
            currentUser: action.user,
            error: null,
            loading: false
        })
    }
    return state;
}
