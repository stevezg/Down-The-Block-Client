import {
  DISPLAY,
  SHOW_ANIMATION,
  FOCUS_ON
} from '../actions/types';

const INITIAL_STATE = {
  display: 'neighbors',
  showAnimation: false,
  focusOn: "",
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DISPLAY:
      return Object.assign({}, state, {
        display: action.component,
      });
    case SHOW_ANIMATION:
      return Object.assign({}, state, {
        showAnimation: action.bool,
      });   
    case FOCUS_ON:
      return Object.assign({}, state, {
        focusOn: action.focus,
      });     
    default:
      return state;
  }
};
