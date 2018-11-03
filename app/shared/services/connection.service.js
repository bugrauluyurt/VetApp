import axios from 'axios';
import * as _isObject from 'lodash/isObject';
import * as _find from 'lodash/find';
import { instance as AuthService } from './auth.service';
import { instance as LoggerService, constructor as LoggerServiceConstructor } from './logger.service';

import { getFakeToken, users, FAKE_API_RETENTION_TIME, getSignUpResponse, resolveUser } from '../fakeApiAssets';
import {
  API_TIMEOUT,
  API_PORT,
  API_BASE_URL,
  API_PATH_SIGNIN,
  API_PATH_SIGNUP,
  API_PATH_SIGNOUT,
  API_PATH_REFRESH_TOKEN,
  API_SECURE,
} from '../constants';
import { ENUM_ERROR_INCORRECT_CREDENTIALS } from '../enums';

class BaseConnection {
  static METHOD_GET = 'get';
  static METHOD_POST = 'post';
  static METHOD_PUT = 'put';
  static METHOD_DELETE = 'delete';

  static INTERCEPTED_URI = [API_PATH_SIGNIN, API_PATH_SIGNOUT, API_PATH_SIGNUP, API_PATH_REFRESH_TOKEN];

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
    if (this.url !== API_PATH_SIGNIN) {
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
      case API_PATH_SIGNIN:
        return new Promise((resolve, reject) => {
          const user = (params.userName && params.password)
            ? _find(users, { userName: params.userName })
            : undefined;
          const isPasswordCorrect = user
            ? user.password.toLowerCase() === params.password.toLowerCase()
            : false;
          if (user && isPasswordCorrect) {
            setTimeout(() => {
              resolve(resolveUser(user, false));
            }, FAKE_API_RETENTION_TIME);
          } else {
            reject(new Error(ENUM_ERROR_INCORRECT_CREDENTIALS));
          }
        });
      case API_PATH_SIGNUP:
        return new Promise((resolve, reject) => {
          const signUpResponse = getSignUpResponse(params);
          if (signUpResponse.isValid) {
            setTimeout(() => {
              resolve(resolveUser(signUpResponse, true));
            }, FAKE_API_RETENTION_TIME);
          } else {
            reject(new Error(signUpResponse.error.enum));
          }
        });
      case API_PATH_REFRESH_TOKEN:
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
    if (BaseConnection.INTERCEPTED_URI.indexOf(this.url) !== -1) {
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
      LoggerService.log(error.message, 'Error', LoggerServiceConstructor.LOG_TYPE_ERROR);
      throw new Error(error.message);
    };
  }

  request(method, params, options) {
    LoggerService.log({
      url: this.url, method, params, options
    }, 'Request');
    const requestInterception = this.requestInterception(method, params);
    if (requestInterception.intercepted && requestInterception.future) {
      LoggerService.log(requestInterception, 'Request Intercepted');
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
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `http${API_SECURE ? 's' : ''}://${API_BASE_URL}:${API_PORT}`,
      timeout: API_TIMEOUT,
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
export const APIConnection = instance.getConnection();
export default instance;
