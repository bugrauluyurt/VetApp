export const API_BASE_URL = process.env.API_URL || 'localhost';
export const API_PORT = process.env.API_PORT || '4000';
export const API_TIMEOUT = 5000;
export const API_SECURE = false;

// API PATHS
export const API_PATH_SIGNIN = '/signin';
export const API_PATH_SIGNUP = '/signup';
export const API_PATH_SIGNOUT = '/signout';
export const API_PATH_REFRESH_TOKEN = '/refreshtoken';

// ROUTES
export const ROUTE_PATH_DEFAULT = '/';
export const ROUTE_PATH_FEATURES = '/features';
export const ROUTE_PATH_AUTHENTICATION = '/authentication';
export const ROUTE_PATH_NOTFOUND = '';

// FORM ICON STYLE
export const FORM_ICON_STYLE = {
  color: 'rgba(0,0,0,.25)',
};
