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
} from '../actions/types';

const INITIAL_STATE = {
  posts: [],
  loading: false,
  error: null,
  searchTerm: '',
  categoryFilter: '',
  postBeingEdited: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return Object.assign({}, state, {
        loading: true,
      });
    case FETCH_POSTS_SUCCESS:
      return Object.assign({}, state, {
        posts: action.posts,
        loading: false,
        error: null,
    })
    case FETCH_POSTS_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error,
    })
    case CREATE_POST_REQUEST:
      return Object.assign({}, state, {
        loading: true,
      });
    case CREATE_POST_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        error: null,
        postBeingEdited: null,
      });
    case CREATE_POST_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error,
      });
    case CHANGE_SEARCH_TERM:
      return Object.assign({}, state, {
        searchTerm: action.searchTerm,
      })
    case CHANGE_CATEGORY_FILTER:
      return Object.assign({}, state, {
        categoryFilter: action.categoryFilter,
      })
    case POST_BEING_EDITED:
      return Object.assign({}, state, {
        postBeingEdited: action.post 
      })
    case DELETE_POST_REQUEST:
      return Object.assign({}, state, {
        loading: true 
      })      
    case DELETE_POST_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        error: null,
        posts: state.posts.filter(post=>post.id!==action.postId) 
      }) 
    case DELETE_POST_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error,
    }) 
    case UPDATED_POST:
      let posts = state.posts.map(post=> post.id===action.post.id ? post=action.post : post)
    return Object.assign({}, state, {
      posts
    })
    case ADD_NEW_POST:
      return Object.assign({}, state, {
        posts: [action.post, ...state.posts ] 
      })
    default:
      return state;
  }
};
