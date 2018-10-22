import { call, put, takeLatest } from 'redux-saga/effects';
import { instance as IdentityService } from '../../shared/services/identity.service';
import { LOGIN_USER } from './constants';
import { loginSuccess, loginError } from './actions';


export function* getLoginData(action) {
  try {
    const userData = yield call(IdentityService.login, [action.username, action.password]);
    yield put(loginSuccess(userData));
  } catch (error) {
    yield put(loginError(error));
  }
}

export default function* getLoginDataWatcher() {
  yield takeLatest(LOGIN_USER, getLoginData);
}
