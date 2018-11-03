/*
 * AppReducer
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

import {
  INIT_APP_SUCCESS,
  INIT_APP,
  INIT_APP_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_APP:
      return state
        .set('loading', true)
        .set('error', false);
    case INIT_APP_SUCCESS:
      return state
        .set('loading', false)
        .set('error', false);
    case INIT_APP_ERROR:
      return state
        .set('loading', false)
        .set('error', true);
    default:
      return state;
  }
}

export default appReducer;
