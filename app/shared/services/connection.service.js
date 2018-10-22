import axios from 'axios';
import * as _isObject from 'lodash/isObject';
import * as _find from 'lodash/find';
import { instance as AuthService } from './auth.service';
import { instance as LoggerService, constructor as LoggerServiceConstructor } from './logger.service';

import { getFakeToken, users, FAKE_API_RETENTION_TIME } from '../fakeApiAssets';
import { API_TIMEOUT, BASE_URL } from '../constants';

class BaseConnection {
  static METHOD_GET = 'get';
  static METHOD_POST = 'post';
  static METHOD_PUT = 'put';
  static METHOD_DELETE = 'delete';

  static INTERCEPTED_URI = ['/login', '/refreshtoken'];

  constructor(axiosInstance, serviceUrl) {
    this.serviceUrl = serviceUrl;
    this.http = axiosInstance;
  }

  setPath(url) {
    this.url = url;
    return this;
  }

  prepareCustomHeaders() {
    const customHeaders = {};
    if (this.url !== '/login') {
      customHeaders.Authorization = `Bearer ${AuthService.getToken()}`;
    }
    return customHeaders;
  }

  prepareConfig(method, params, options) {
    const config = {};
    config.method = method;
    config.url = this.url;
    if (params && _isObject(params)) {
      config.params = params;
    }
    if (options && _isObject(options)) {
      Object.keys(options).forEach((optionsKey) => {
        config[optionsKey] = options[optionsKey];
      });
    }
    return config;
  }

  getInterceptionFutureValue(method, params) {
    switch (this.url) {
      case '/login':
        return new Promise((resolve, reject) => {
          const user = _find(users, { id: params.id });
          if (user) {
            setTimeout(() => {
              resolve({
                id: user.id,
                userName: user.username,
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                token: getFakeToken(),
              });
            }, FAKE_API_RETENTION_TIME);
          } else {
            reject(new Error('Username or password is incorrect'));
          }
        });
      case '/refreshtoken':
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ ...getFakeToken('refresh') });
          }, FAKE_API_RETENTION_TIME);
        });
      default:
        return undefined;
    }
  }

  requestInterception(method, params) {
    let future;
    let isIntercepted = false;
    if (BaseConnection.INTERCEPTED_URI.indexOf(method) !== -1) {
      isIntercepted = true;
      const futureValue = this.getInterceptionFutureValue(method, params);
      if (futureValue) {
        future = futureValue;
      }
    }
    return {
      intercepted: isIntercepted,
      future,
    };
  }

  handleRequestSuccess() {
    return (response) => response.data;
  }

  handleRequestError() {
    return (error) => {
      LoggerService.log(error.message, LoggerServiceConstructor.LOG_TYPE_ERROR);
      throw new Error(error.message);
    };
  }

  request(method, params, options) {
    const requestInterception = this.requestInterception(method, params, options);
    if (requestInterception.intercepted && requestInterception.future) {
      return requestInterception.future;
    }
    const config = this.prepareConfig(method, params, options);
    return AuthService.checkRefresh()
      .then(() => this.http(config).then(this.handleRequestSuccess()).catch(this.handleRequestError()));
  }

  get(params, body, options) {
    return this.request(BaseConnection.METHOD_GET, params, options);
  }

  post(params, body) {
    let postBody;
    if (body) {
      if (body instanceof FormData) {
        postBody = body;
      } else if (_isObject(body)) {
        postBody = new FormData();
        Object.keys(body).forEach((bodyKey) => {
          postBody.set(bodyKey, body[bodyKey]);
        });
      }
    }
    const customHeaders = this.prepareCustomHeaders();
    if (postBody) {
      customHeaders['Content-Type'] = 'multipart/form-data';
    }
    const options = { headers: customHeaders };
    return this.request(BaseConnection.METHOD_POST, params, options);
  }

  put(params, body, options) {
    return this.request(BaseConnection.METHOD_PUT, params, options);
  }

  delete(params, body, options) {
    return this.request(BaseConnection.METHOD_DELETE, params, options);
  }
}

class ConnectionFactoryService {
  static baseURL = BASE_URL;
  static timeout = API_TIMEOUT;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ConnectionFactoryService.baseURL,
      timeout: ConnectionFactoryService.timeout,
    });
    // Creates a generic default connection
    this.connection = this.create();
  }

  getConnection() {
    return this.connection;
  }

  // New connection instance can be created if required
  create() {
    return new BaseConnection(this.axiosInstance, `${ConnectionFactoryService.baseURL}/`);
  }
}

export const constructor = ConnectionFactoryService;
export const instance = new ConnectionFactoryService();
export default instance;
