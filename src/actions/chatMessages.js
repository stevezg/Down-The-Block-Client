import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';
import {
    FETCH_CHAT_REQUEST,
    FETCH_CHAT_SUCCESS,
    FETCH_CHAT_ERROR,
    FETCH_PINNED_CHAT_USERS_REQUEST,
    FETCH_PINNED_CHAT_USERS_SUCCESS,
    FETCH_PINNED_CHAT_USERS_ERROR,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSSAGE_ERROR,
    UPDATE_CHAT,
    SET_NAMESPACE,
    SET_NEW_DAY
} from './types';
import {display} from './navigation';

export const fetchChatRequest = () => ({
    type: FETCH_CHAT_REQUEST,
})

export const fetchChatSuccess = (chat, namespace) => ({
  type: FETCH_CHAT_SUCCESS,
  chat,
  namespace
})

export const fetchChatError= (error) => ({
  type: FETCH_CHAT_ERROR,
  error
})

export const fetchPinnedChatUsersRequest = () => ({
    type: FETCH_PINNED_CHAT_USERS_REQUEST,
})

export const fetchPinnedChatUsersSuccess = (pinnedChatUsers) => ({
  type: FETCH_PINNED_CHAT_USERS_SUCCESS,
  pinnedChatUsers
})

export const fetchPinnedChatUsersError= (error) => ({
  type: FETCH_PINNED_CHAT_USERS_ERROR,
  error
})

export const fetchPinnedChatUsers = () => (dispatch, getState) => {
    dispatch(fetchPinnedChatUsersRequest())

    const authToken = getState().auth.authToken;

    fetch(`${API_BASE_URL}/users/pinnedChatUsers`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(pinnedChatUsers => {
            dispatch(fetchPinnedChatUsersSuccess(pinnedChatUsers))
        })
        .catch(error => {
            dispatch(fetchPinnedChatUsersError(error));
        });
};

export const deletePinnedChat = (userId) => (dispatch, getState) => {
    dispatch(fetchPinnedChatUsersRequest())

    const authToken = getState().auth.authToken;

    fetch(`${API_BASE_URL}/users/pinnedChatUsers/${userId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(pinnedChatUsers => {
            dispatch(fetchPinnedChatUsersSuccess(pinnedChatUsers))
        })
        .catch(error => {
            dispatch(fetchPinnedChatUsersError(error));
        });
};

export const fetchChat = (namespace, userId1, userId2) => (dispatch, getState) => {
    dispatch(fetchChatRequest());
    const authToken = getState().auth.authToken;

    fetch(`${API_BASE_URL}/chats/${namespace}/${userId1}/${userId2}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(chat => {
            dispatch(fetchChatSuccess(chat, namespace));
            dispatch(fetchPinnedChatUsers())
        })
        .then(()=>{
            dispatch(display('chat')); 
        })
        .catch(error => {
            dispatch(fetchChatError(error));
        });
};

export const sendMessageRequest = () => ({
    type: SEND_MESSAGE_REQUEST,
})

export const sendMessageSuccess = (chat) => ({
  type: SEND_MESSAGE_SUCCESS,
  chat
})

export const sendMessageError= (error) => ({
  type: SEND_MESSSAGE_ERROR,
  error
})

export const sendMessage = (namespace, content, date, author, chatId) => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    dispatch(sendMessageRequest());
    return (
        fetch(`${API_BASE_URL}/messages/${namespace}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
                content, 
                date,
                chatId, 
                author
            })
        })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((chat) =>{ 
            dispatch(sendMessageSuccess(chat, namespace));
        })
        .catch(err => {
            dispatch(sendMessageError(err));
        })
    );
}

export const updateChat = (chat) => ({
    type: UPDATE_CHAT,
    chat
})

export const setNamespace = (namespace) => ({
    type: SET_NAMESPACE,
    namespace
})

export const setNewDay = (day) => ({
    type: SET_NEW_DAY,
    day
})