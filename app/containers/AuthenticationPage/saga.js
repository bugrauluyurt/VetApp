import { call, put, takeLatest } from 'redux-saga/effects';
import { instance as IdentityService } from '../../shared/services/identity.service';
import { SIGNIN_USER } from './constants';
import { signInSuccess, signInError } from './actions';

export function* getSignInData(action) {
  try {
    const userData = yield call(IdentityService.signIn, [action.username, action.password, action.rememberMe]);
    yield put(signInSuccess(userData));
  } catch (error) {
    yield put(signInError(error));
  }
}

export default function* getLoginDataWatcher() {
  yield takeLatest(SIGNIN_USER, getSignInData);
}
