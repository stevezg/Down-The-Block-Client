import  { 
  COMMENT_BEING_EDITED
} from '../actions/types';

const initialState = {
    commentBeingEdited:null, 
};

export default (state=initialState, action) => {
    switch (action.type) {
        case COMMENT_BEING_EDITED:
          return Object.assign({}, state, {
            commentBeingEdited: action.comment 
          })
        default: 
            return state
            
    };
};
