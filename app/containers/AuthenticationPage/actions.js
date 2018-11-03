import {
  SIGNIN_USER,
  SIGNIN_USER_SUCCESS,
  SIGNIN_USER_ERROR,
  UPDATE_USER
} from './constants';

export function signIn({ userName, password, rememberMe }) {
  return {
    type: SIGNIN_USER,
    userName,
    password,
    rememberMe
  };
}

export function signInSuccess(userData) {
  return {
    type: SIGNIN_USER_SUCCESS,
    userData
  };
}

export function signInError(error) {
  return {
    type: SIGNIN_USER_ERROR,
    errorEnum: error.message
  };
}

export function updateUser(user) {
  return {
    type: UPDATE_USER,
    user,
  };
}
