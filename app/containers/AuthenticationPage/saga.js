import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { instance as IdentityService } from '../../shared/services/identity.service';
import { SIGNIN_USER } from './constants';
import { signInSuccess, signInError } from './actions';
import { ROUTE_PATH_FEATURES } from '../../shared/constants';

export function* getSignInData(action) {
  try {
    const userData = yield call(
      IdentityService.signIn,
      { userName: action.userName, password: action.password, rememberMe: action.rememberMe }
    );
    yield put(signInSuccess(userData));
    yield put(push(ROUTE_PATH_FEATURES));
  } catch (error) {
    yield put(signInError(error));
  }
}

export default function* getLoginDataWatcher() {
  yield takeLatest(SIGNIN_USER, getSignInData);
}
