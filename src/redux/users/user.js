import * as $ from './constants';
import './typedef';

let idCounter = 1;

/**
 * @param {User} state
 * @param {Action} action
 */
const user = (state = {}, action) => {
  switch (action.type) {
    case $.ADD_USER:
      return {
        ...action.payload,
        number: idCounter++,
      }
    case $.UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case $.DEL_USER:
      return (state.id === action.payload.id)
        ? null
        : state;
    default:
      return state;
  }
}

export default user;
