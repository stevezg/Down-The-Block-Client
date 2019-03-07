import {
    FETCH_POSTS_REQUEST,
    FETCH_POSTS_SUCCESS,
    FETCH_POSTS_ERROR,
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_ERROR,
    CHANGE_SEARCH_TERM,
    CHANGE_CATEGORY_FILTER,
    POST_BEING_EDITED,
    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    DELETE_POST_ERROR,
    UPDATED_POST,
    ADD_NEW_POST
  } from './types';
  import {API_BASE_URL} from '../config';
  import {normalizeResponseErrors} from './utils';
  import {SubmissionError} from 'redux-form';
  import {display} from './navigation';

  export const fetchPostsRequest = () => ({
      type: FETCH_POSTS_REQUEST,
  })

  export const fetchPostsSuccess = (posts) => ({
    type: FETCH_POSTS_SUCCESS,
    posts
  })

  export const fetchPostsError= (error) => ({
    type: FETCH_POSTS_ERROR,
    error
  })

  export const fetchPosts = (coords, forum) => (dispatch, getState) => {
      dispatch(display(forum))
      dispatch(fetchPostsRequest());
      const authToken = getState().auth.authToken;
      let simplifiedGeoObject = {
        latitude: coords.latitude,
        longitude: coords.longitude
      }
      let stringifiedObj = JSON.stringify(simplifiedGeoObject);
      fetch(`${API_BASE_URL}/posts/${stringifiedObj}/${forum}`, {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${authToken}`
          },
      })
          .then(res => normalizeResponseErrors(res))
          .then(res => res.json())
          .then(posts => {
              dispatch(fetchPostsSuccess(posts));
          })
          .catch(error => {
              dispatch(fetchPostsError(error));
          });
  };

  export const createPostRequest = () => ({
      type: CREATE_POST_REQUEST,
  })

  export const createPostSuccess = () => ({
    type: CREATE_POST_SUCCESS,
  })

  export const createPostError= (error) => ({
    type: CREATE_POST_ERROR,
    error
  })

  export const addNewPost = (post) => ({
      type:ADD_NEW_POST,
      post
  });

  export const submitPost = (postId, values, coords, forum) => (dispatch, getState) =>{
    let formData = new FormData();

    Object.keys(values).forEach(item=> {
        if(values[item]!==undefined){
            formData.append(item, (values[item]))
        }
    });

      dispatch(createPostRequest());
      const authToken = getState().auth.authToken;
      const method = postId ? "PUT" : "POST";

      let simplifiedGeoObject = {
          latitude: coords.latitude,
          longitude: coords.longitude
        };
      let stringifiedObj = JSON.stringify(simplifiedGeoObject);
  
      const path = postId ? `${API_BASE_URL}/posts/${postId}` : `${API_BASE_URL}/posts/${stringifiedObj}/${forum}`; 
  
      return fetch(path, { 
          method,
          headers: {
              Authorization: `Bearer ${authToken}`
          },
          body: formData
      })
      .then(res => normalizeResponseErrors(res))
      .then(res => {

         return res.json()
        })
      .then(() => {
          dispatch(createPostSuccess());
      })
      .catch(error => {
          dispatch(createPostError(error));
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
                      _error: 'Unable to create post, please try again',
                  })
              );
          }
      });
  }

  export const deletePostRequest = () => ({
      type: DELETE_POST_REQUEST,
  })

  export const deletePostSuccess = (postId) => ({
    type: DELETE_POST_SUCCESS,
    postId
  })

  export const deletePostError= (error) => ({
    type: DELETE_POST_ERROR,
    error
  })

  export const deletePost = (postId) => (dispatch, getState) =>{
      dispatch(deletePostRequest());
      const authToken = getState().auth.authToken;

      fetch(`${API_BASE_URL}/posts/${postId}`, {
          method: 'DELETE',
          headers: {
              // Provide our auth token as credentials
              Authorization: `Bearer ${authToken}`
          },
      })
      .then(res => normalizeResponseErrors(res))
      .catch(error => {
          dispatch(deletePostError(error));
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
                      _error: 'Unable to delete post, please try again',
                  })
              );
          }
      });
  }


  export const postBeingEdited= (post) => ({
      type: POST_BEING_EDITED,
      post,
    })

  export const changeSearchTerm = (searchTerm) =>({
      type: CHANGE_SEARCH_TERM,
      searchTerm
  })

  export const changeCategoryFilter = (categoryFilter) =>({
      type: CHANGE_CATEGORY_FILTER,
      categoryFilter
  })

  export const updatePost = (post) => ({
      type: UPDATED_POST,
      post
  })
