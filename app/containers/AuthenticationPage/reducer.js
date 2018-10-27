/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import { SIGNIN_USER, SIGNIN_USER_SUCCESS, SIGNIN_USER_ERROR } from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  userData: {},
});

function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case SIGNIN_USER:
      return state
        .set('loading', true)
        .set('error', false);
    case SIGNIN_USER_SUCCESS:
      return state
        .set('loading', false)
        .set('userData', action.userData);
    case SIGNIN_USER_ERROR:
      return state
        .set('loading', false)
        .set('error', true);
    default:
      return state;
  }
}

export default authenticationReducer;
