import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';
import {SubmissionError} from 'redux-form';
import  
    { 
        POST_COMMENT_REQUEST, 
        POST_COMMENT_SUCCESS, 
        POST_COMMENT_ERROR,  
        DELETE_COMMENT_REQUEST,
        DELETE_COMMENT_SUCCESS,
        DELETE_COMMENT_ERROR,
        COMMENT_BEING_EDITED
    } 
from './types'; 

export const postCommentRequest = () => ({
    type: POST_COMMENT_REQUEST
});

export const postCommentSuccess = (response) => ({
    type: POST_COMMENT_SUCCESS,
    response
});

export const postCommentError = (error) => ({
    type: POST_COMMENT_ERROR,
    error
});

export const addComment = (content, date, userId, postId, commentId) => (dispatch, getState) => {
    const authToken = getState().auth.authToken;
    
    const method = commentId ? "PUT" : "POST";
    const path = commentId ? `${API_BASE_URL}/comments/${postId}/${commentId}` : `${API_BASE_URL}/comments`; 

    dispatch(postCommentRequest());
    return (
        fetch(path, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
                content, 
                date,
                userId, 
                postId
            })
        })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((post) =>{ 
            dispatch(postCommentSuccess(post));
        })
        .catch(err => {
            dispatch(postCommentError(err));
        })
    );
}

export const deleteCommentRequest = () => ({
    type: DELETE_COMMENT_REQUEST,
})

export const deleteCommentSuccess = (commentId) => ({
  type: DELETE_COMMENT_SUCCESS,
  commentId
})

export const deleteCommentError= (error) => ({
  type: DELETE_COMMENT_ERROR,
  error
})

export const deleteComment = (commentId, postId) => (dispatch, getState) =>{
    dispatch(deleteCommentRequest());
    const authToken = getState().auth.authToken;

    fetch(`${API_BASE_URL}/comments/${postId}/${commentId}`, {
        method: 'DELETE',
        headers: {
            // Provide our auth token as credentials
            Authorization: `Bearer ${authToken}`
        },
    })
    .then(res => normalizeResponseErrors(res))
    .catch(error => {
        dispatch(deleteCommentError(error));
        const {message, location, status} = error;
        if (status === 400) {
            // Convert errors into SubmissionErrors for Redux Form
            return Promise.reject(
                new SubmissionError({
                    [location]: message
                })
            );
        }
        else{
            return Promise.reject(
                new SubmissionError({
                    _error: 'Unable to delete comment, please try again',
                })
            );
        }
    });
}

export const commentBeingEdited= (comment) => ({
    type: COMMENT_BEING_EDITED,
    comment,
})
