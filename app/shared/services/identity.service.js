import { instance as ConnectionFactoryService } from './connection.service';
import { AuthToken, instance as AuthService } from './auth.service';
import { instance as LocalForage } from './localforage.service';
import { API_PATH_SIGNIN, API_PATH_SIGNUP } from '../constants';

function handleAuthoriationSuccess(resolve, params) {
  return (response) => {
    const token = new AuthToken(response.token);
    AuthService.setToken(token);
    if (!params.rememberMe) {
      resolve(response);
    }
    const user = { ...response.user, token, rememberMe: params.rememberMe };
    LocalForage.setItem('user', user).then(() => resolve(user));
  };
}

function handleAuthorizationError(reject) {
  return (error) => {
    AuthService.destroy();
    LocalForage.destroy().then(() => reject(error));
  };
}

class IdentityService {
  // *** Connection instance ***
  connection = ConnectionFactoryService.getConnection();

  signIn(userName, password, rememberMe) {
    return new Promise((resolve, reject) => {
      const params = { userName, password, rememberMe };
      this.connection
        .setPath(API_PATH_SIGNIN)
        .get(params)
        .then(handleAuthoriationSuccess(resolve, params))
        .catch(handleAuthorizationError(reject));
    });
  }

  signUp(params) {
    // Params: { userName, firstName, lastName, email, password, rememberMe };
    return new Promise((resolve, reject) => {
      this.connection
        .setPath(API_PATH_SIGNUP)
        .get(params)
        .then(handleAuthoriationSuccess(resolve, params))
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
