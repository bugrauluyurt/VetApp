import * as _cloneDeep from 'lodash/cloneDeep';
import { instance as ConnectionFactoryService } from './connection.service';
import { instance as LocalForage } from './localforage.service';

class AuthService {
  static TOKEN_EXPIRATION_TIME_DEFAULT = 60 * 1000000; // min
  static TOKEN_EXPIRATION_BUFFER = 60 * 1000; // sec
  connection = ConnectionFactoryService.create();
  tokenRefreshing = false;

  setToken(token) {
    this.token = token.body;
    this.tokenExpirationTime = token.expirationTime || AuthService.TOKEN_EXPIRATION_TIME_DEFAULT;
    this.destroyTimeout();
    this.tokenTimeoutCounter = setTimeout(
      this.refreshToken,
      AuthService.TOKEN_EXPIRATION_TIME_DEFAULT - AuthService.TOKEN_EXPIRATION_BUFFER
    );
  }

  getToken() {
    return this.token.body;
  }

  refreshToken() {
    this.tokenRefreshing = true;
    this.tokenRefreshPromise = this.connection
      .setPath('/refreshtoken')
      .get({ token: this.token.body })
      .then((token) => {
        this.tokenRefreshing = false;
        this.setToken(token);
        LocalForage.getItem('user').then((user) => {
          const clonedUser = _cloneDeep(user);
          clonedUser.token = token;
          LocalForage.setItem('user', clonedUser);
        });
      });
  }

  checkRefresh() {
    if (!this.isRefreshingToken()) {
      return Promise;
    }
    return this.tokenRefreshPromise;
  }

  isRefreshingToken() {
    return this.tokenRefreshing;
  }

  destroyTimeout() {
    if (this.tokenTimeoutCounter) return;
    this.tokenTimeoutCounter.clearTimeout();
  }

  destroy() {
    this.token = undefined;
    this.destroyTimeout();
  }
}

export const constructor = AuthService;
export const instance = new AuthService();
export default instance;
