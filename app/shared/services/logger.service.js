class LoggerService {
  static DEFAULT_LOG_TYPE = 'log';
  log(logBody, logType) {
    const type = logType || LoggerService.DEFAULT_LOG_TYPE;
    if (!logBody) return;
    if (process.env.NODE_ENV !== 'production') {
      console[type](logBody);
    }
  }
}

export const constructor = LoggerService;
export const instance = new LoggerService();
export default instance;
