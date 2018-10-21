import { instance as ConnectionFactoryService } from './connection.service';
import { instance as AuthService } from './auth.service';
import { instance as LocalForage } from './localforage.service';


class IdentityService {
  connection = ConnectionFactoryService.create();
  login(userName, password) {
    return new Promise((resolve, reject) => {
      this.connection
        .setPath('/login')
        .get({ userName, password })
        .then((response) => {
          AuthService.setToken(response.token);
          LocalForage.setItem('user', response.user).then(() => resolve(response));
        })
        .catch((error) => {
          AuthService.destroy();
          LocalForage.destroy().then(() => reject(error));
        });
    });
  }
  logout() {
    AuthService.destroy();
    return new Promise((resolve, reject) => {
      LocalForage.destroy().then(() => {
        window.location.href = '/login';
        resolve();
      }).catch(() => reject());
    });
  }
}

export const constructor = IdentityService;
export const instance = new IdentityService();
export default instance;
