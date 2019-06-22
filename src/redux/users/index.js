import faker from 'faker';
import * as $ from './constants';
import user from './user';
import './typedef';

/**
 *
 * @param {Object<string, User>} state
 * @param {Action} action
 */
const users = (state = {}, action) => {
  switch (action.type) {
    case $.ADD_USER:
      if (state[action.payload.name])
        throw new Error(`${action.payload.name} already in list`);

      return {
        ...state,
        [action.payload.name]: user(undefined, action),
      };
    default:
      return state;
  }
}

/**
 * @param {User} user
 */
export function addUser(user) {
  return {
    type: $.ADD_USER,
    payload: user,
  }
}

export function addRandomUser() {
  return {
    type: $.ADD_USER,
    payload: {
      name: faker.name.firstName(),
      phone: faker.phone.phoneNumber('09########'),
      email: faker.internet.email(),
    }
  }
}

export default users;
