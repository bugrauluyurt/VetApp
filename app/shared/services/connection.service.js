import axios from 'axios';
import * as _isObject from 'lodash/isObject';
import { instance as LoggerService } from './logger.service';

class BaseConnection {
  static METHOD_GET = 'get';
  static METHOD_POST = 'post';
  static METHOD_PUT = 'put';
  static METHOD_DELETE = 'delete';

  constructor(axiosInstance, serviceUrl) {
    this.serviceUrl = serviceUrl;
    this.http = axiosInstance;
  }

  setPath(url) {
    this.url = url;
    return this;
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

  handleRequestSuccess(successFn) {
    return (data) => {
      successFn(data);
      return data;
    };
  }

  handleRequestError(errorFn) {
    return (error) => {
      LoggerService.log(error);
      errorFn(error);
      return error;
    };
  }

  request(method, params, options, successFn, errorFn) {
    const config = this.prepareConfig(method, params, options);
    return this.http(config).then(this.handleRequestSuccess(successFn)).catch(this.handleRequestError(errorFn));
  }

  get(successFn, errorFn, params, body, options) {
    return this.request(BaseConnection.METHOD_GET, params, options, successFn, errorFn);
  }

  post(successFn, errorFn, params, body) {
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
    const options = postBody ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return this.request(BaseConnection.METHOD_POST, params, options, successFn, errorFn);
  }

  put(successFn, errorFn, params, body, options) {
    return this.request(BaseConnection.METHOD_PUT, params, options, successFn, errorFn);
  }

  delete(successFn, errorFn, params, body, options) {
    return this.request(BaseConnection.METHOD_DELETE, params, options, successFn, errorFn);
  }
}

class ConnectionFactoryService {
  static baseURL = process.env.API_URL || 'localhost';
  static timeout = 5000;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: ConnectionFactoryService.baseURL,
      timeout: ConnectionFactoryService.timeout,
    });
  }

  create() {
    return new BaseConnection(this.axiosInstance, `${ConnectionFactoryService.baseURL}/`);
  }
}

export const constructor = ConnectionFactoryService;
export const instance = new ConnectionFactoryService();
export default instance;
