import uuid from 'uuid/v4';
import faker from 'faker';
import { mapValues, pickBy } from 'lodash';
import * as $ from './constants';
import user from './user';
import './typedef';
import { combineReducers } from 'redux';

/**
 *
 * @param {Object<string, User>} state
 * @param {Action} action
 */
const byId = (state = {}, action) => {
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

const allIds = (state = [], action) => {
  switch (action.type) {
    case $.ADD_USER:
      return [...state, action.payload.id];
    case $.DEL_USER:
      return state.filter(id => id !== action.payload.id);
    default:
      return state;
  }
}

const nameInUsed = (state = new Set(), action) => {
  switch (action.type) {
    case $.ADD_USER:
      return new Set(state.add(action.payload.name));
    case $.UPDATE_USER:
      state.delete(action.original.name);
      return new Set(state.add(action.payload.name));
    case $.DEL_USER:
      state.delete(action.payload.name);
      return new Set(state);
    default:
      return state;
  }
}

/**
 * @param {User} user
 */
export function addUser(user) {
  return (dispatch, getState) => {
    const { nameInUsed } = getState().users;

    if (nameInUsed.has(user.name)) {
      throw new Error(`${user.name} already in used`);
    }

    dispatch({
      type: $.ADD_USER,
      payload: {
        id: uuid(),
        ...user
      },
    })
  }
}

export function addRandomUser() {
  return addUser({
    id: uuid(),
    name: faker.name.firstName(),
    phone: faker.phone.phoneNumber('09########'),
    email: faker.internet.email(),
  });
}

/**
 *
 * @param {User} user
 */
export function updateUser(modifiedUser) {
  return (dispatch, getState) => {
    const user = getState().users.byId[modifiedUser.id];

    dispatch({
      type: $.UPDATE_USER,
      original: user,
      payload: modifiedUser,
    })
  }
}

/**
 * @param {string} userName
 */
export function delUser(id) {
  return (dispatch, getState) => {
    const user = getState().users.byId[id];

    dispatch({
      type: $.DEL_USER,
      payload: user,
    });
  }
}

export default combineReducers({
  byId,
  allIds,
  nameInUsed,
});
