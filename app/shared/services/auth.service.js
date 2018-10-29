import * as _cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';
import { instance as LocalForage } from './localforage.service';
import { API_TIMEOUT, BASE_URL } from '../constants';

const TOKEN_EXPIRATION_TIME_DEFAULT = 60 * 1000000; // min
const TOKEN_EXPIRATION_BUFFER = 60 * 1000; // sec

export class AuthToken {
  body;
  expiresIn;
  timeReceived;
  constructor(token) {
    this.body = token.access_token;
    this.expiresIn = token.expires_in || TOKEN_EXPIRATION_TIME_DEFAULT;
    this.timeReceived = new Date();
  }
}

class AuthService {
  // New axios instance created to prevent circular dependency
  connection = axios.create({
    baseURL: BASE_URL,
    timeout: API_TIMEOUT,
  });
  tokenRefreshing = false;

  initiate() {
    return this.setExistingToken();
  }

  setExistingToken() {
    return new Promise((resolve) => {
      LocalForage.getItem('user').then((existingUser) => {
        const isTokenExpired = AuthService.isTokenExpired(existingUser.token);
        if (!isTokenExpired) {
          this.setToken(existingUser.token);
        }
        resolve({ ...existingUser, isTokenExpired });
      }).catch(() => resolve({ isTokenExpired: undefined }));
    });
  }

  setToken(token) {
    this.token = token;
    this.destroyTimeout();
    const expirationTime = (token.timeReceived + token.expiresIn);
    const now = new Date();
    this.tokenTimeoutCounter = setTimeout(
      this.refreshToken,
      (expirationTime - now - TOKEN_EXPIRATION_BUFFER)
    );
  }

  getToken() {
    return this.token;
  }

  refreshToken() {
    this.tokenRefreshing = true;
    this.tokenRefreshPromise = this.connection
      .get('/refreshtoken', { params: { token: this.token.body } })
      .then((token) => {
        this.tokenRefreshing = false;
        this.setToken(new AuthToken(token));
        return LocalForage.getItem('user').then((user) => {
          const clonedUser = _cloneDeep(user);
          clonedUser.token = token;
          LocalForage.setItem('user', clonedUser);
        });
      });
  }

  checkRefresh() {
    if (!this.isRefreshingToken()) {
      return Promise.resolve();
    }
    return this.tokenRefreshPromise;
  }

  isRefreshingToken() {
    return this.tokenRefreshing;
  }

  static isTokenExpired(token) {
    const expirationTime = (token.timeReceived + token.expiresIn);
    const now = new Date();
    return (expirationTime - TOKEN_EXPIRATION_BUFFER) < now;
  }

  destroyTimeout() {
    if (!this.tokenTimeoutCounter) return;
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
