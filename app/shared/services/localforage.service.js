import localforage from 'localforage';

class LocalForageService {
  instanceStorage = {};

  static INSTANCE_DEFAULT = 'defaultInstance';
  static INSTANCE_USER = 'userInstance';

  constructor() {
    this.createInstance();
  }

  createInstance(instanceName) {
    const instance = instanceName || LocalForageService.INSTANCE_DEFAULT;
    this.instanceStorage[instance] = localforage.createInstance({ name: instance });
  }

  setItem(key, value, instance, callback) {
    this.checkInstance(instance);
    return this.instanceStorage[instance].setItem(key, value)
      .then(() => {
        const item = { key, value, type: 'set' };
        if (callback) {
          callback(item);
        }
        return item;
      });
  }

  getItem(key, instance, callback) {
    this.checkInstance(instance);
    return this.instanceStorage[instance].getItem(key)
      .then((value) => {
        const item = { key, value, type: 'get' };
        if (callback) {
          callback(item);
        }
        return item;
      });
  }

  checkInstance(instance) {
    const processedInstance = instance || LocalForageService.INSTANCE_DEFAULT;
    if (!this.instanceStorage[processedInstance]) {
      this.createInstance(processedInstance);
    }
    return instance;
  }

  destroy(instance) {
    if (!instance) {
      Object.keys(this.instanceStorage).forEach((instanceKey) => {
        this.instanceStorage[instanceKey].clear();
      });
      this.instanceStorage = {};
      return Promise.resolve();
    }
    return this.instanceStorage[instance].clear().then(() => {
      delete this.instanceStorage[instance];
    });
  }
}

export const constructor = LocalForageService;
export const instance = new LocalForageService();
export default instance;
