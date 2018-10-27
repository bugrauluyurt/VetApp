import { instance as ConnectionFactoryService } from './connection.service';
import { AuthToken, instance as AuthService } from './auth.service';
import { instance as LocalForage } from './localforage.service';

export const API_PATH_SIGNIN = '/signin';

class IdentityService {
  connection = ConnectionFactoryService.getConnection();
  signIn(userName, password, rememberMe) {
    return new Promise((resolve, reject) => {
      this.connection
        .setPath(API_PATH_SIGNIN)
        .get({ userName, password, rememberMe })
        .then((response) => {
          const token = new AuthToken(response.token);
          AuthService.setToken(token);
          if (!rememberMe) {
            resolve(response);
          }
          const user = { ...response.user, token, rememberMe };
          LocalForage.setItem('user', user).then(() => resolve(user));
        })
        .catch((error) => {
          AuthService.destroy();
          LocalForage.destroy().then(() => reject(error));
        });
    });
  }
  signOut() {
    AuthService.destroy();
    return new Promise((resolve, reject) => {
      LocalForage.destroy().then(() => {
        // @TODO Push history to login page once localforage is destroyed. Clear user data from redux-store
        resolve();
      }).catch(() => reject());
    });
  }
}

export const constructor = IdentityService;
export const instance = new IdentityService();
export default instance;
