class LoggerService {
  static LOG_TYPE_DEFAULT = 'log';
  static LOG_TYPE_ERROR = 'error';

  log(logBody, logType) {
    const type = logType || LoggerService.LOG_TYPE_DEFAULT;
    if (!logBody) return;
    if (process.env.NODE_ENV !== 'production') {
      console[type](logBody);
    }
  }
}

export const constructor = LoggerService;
export const instance = new LoggerService();
export default instance;
