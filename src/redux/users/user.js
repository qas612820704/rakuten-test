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
    default:
      return state;
  }
}

export default user;
