import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
} from './constants';

export function login(username, password) {
  return {
    type: LOGIN_USER,
    username,
    password,
  };
}

export function loginSuccess(userData) {
  return {
    type: LOGIN_USER_SUCCESS,
    userData
  };
}

export function loginError(error) {
  return {
    type: LOGIN_USER_ERROR,
    error
  };
}
