import uuid from 'uuid/v4';
import faker from 'faker';
import { mapValues, pickBy } from 'lodash';
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
      return {
        ...state,
        [action.payload.id]: user(undefined, action),
      };
    case $.UPDATE_USER:
      return {
        ...state,
        [action.payload.id]: user(state[action.payload.id], action),
      };
    case $.DEL_USER:
        const usersWithDeleted = mapValues(state, u => user(u, action));
        return pickBy(usersWithDeleted, user => !!user); // select non null user
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
    payload: {
      id: uuid(),
      ...user
    },
  }
}

export function addRandomUser() {
  return {
    type: $.ADD_USER,
    payload: {
      id: uuid(),
      name: faker.name.firstName(),
      phone: faker.phone.phoneNumber('09########'),
      email: faker.internet.email(),
    }
  }
}

/**
 *
 * @param {User} user
 */
export function updateUser(user) {
  return {
    type: $.UPDATE_USER,
    payload: user,
  };
}

/**
 * @param {string} userName
 */
export function delUser(userId) {
  return {
    type: $.DEL_USER,
    payload: {
      id: userId
    },
  }
}

export default users;
