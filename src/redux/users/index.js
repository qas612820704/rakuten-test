import uuid from 'uuid/v4';
import faker from 'faker';
import { isMobilePhone, isEmail } from 'validator';
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

function userValidator(user, state) {
  user = {
    ...user,
    name: user.name.trim(),
    phone: user.phone.trim(),
    email: user.email.trim(),
  };

  const nameInUsed = state.users.nameInUsed;
  const originalUser = state.users.byId[user.id];
  const error = {};

  if(!user.name) {
    error.name = "Name can't be null";
  }

  if (nameInUsed.has(user.name) && originalUser && originalUser.name !== user.name) {
    error.name = `${user.name} already in used`;
  }

  if (!isMobilePhone(user.phone) && user.phone !== '') {
    error.phone = `Not Valid Format`;
  }

  if (!isEmail(user.email)) {
    error.email = 'Not Valid Format';
  }

  if (user.email === '') {
    error.email = "Email can't be null";
  }

  return Object.keys(error).length > 0 ? error : null;
}

/**
 * @param {User} user
 */
export function addUser(user) {
  return (dispatch, getState) => {
    user = {
      name: '',
      phone: '',
      email: '',
      ...user,
    };

    const error = userValidator(user, getState());

    if (error) throw error;

    return dispatch({
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
    const state = getState();

    const error = userValidator(modifiedUser, state);

    if (error) throw error;

    const user = state.users.byId[modifiedUser.id];
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
