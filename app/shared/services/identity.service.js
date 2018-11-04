import _omit from 'lodash/omit';
import { APIConnection } from './connection.service';
import { AuthToken, instance as AuthService } from './auth.service';
import { instance as LocalForage } from './localforage.service';
import { API_PATH_SIGNIN, API_PATH_SIGNUP } from '../constants';

function handleAuthorizationSuccess(resolve, params) {
  return (response) => {
    const token = new AuthToken(response.token);
    AuthService.setToken(token);
    const filteredData = _omit(response, ['password']);
    console.log('Params from login', params);
    console.log('Response', response);
    if (!params.rememberMe) {
      resolve(filteredData);
      return;
    }
    const user = { ...filteredData, token };
    LocalForage.setItem('user', user).then(() => resolve(user));
  };
}

function handleAuthorizationError(reject) {
  return (error) => {
    AuthService.destroy();
    LocalForage.destroy().then(() => reject(error));
    return error;
  };
}

class IdentityService {
  signIn(params) {
    // Params: { userName, password, rememberMe };
    return new Promise((resolve, reject) => {
      APIConnection
        .setPath(API_PATH_SIGNIN)
        .get(params)
        .then(handleAuthorizationSuccess(resolve, params))
        .catch(handleAuthorizationError(reject));
    });
  }

  signUp(params) {
    // Params: { userName, firstName, lastName, email, password, rememberMe };
    return new Promise((resolve, reject) => {
      APIConnection
        .setPath(API_PATH_SIGNUP)
        .get(params)
        .then(handleAuthorizationSuccess(resolve, params))
        .catch(handleAuthorizationError(reject));
    });
  }

  signOut() {
    AuthService.destroy();
    return LocalForage.destroy();
  }
}

export const constructor = IdentityService;
export const instance = new IdentityService();
export default instance;
