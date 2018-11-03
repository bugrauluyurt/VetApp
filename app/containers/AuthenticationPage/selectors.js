/**
 * Authentication page selectors
 */

import { createSelector } from 'reselect';

const selectAuthentication = (state) => state.get('user');

const makeSelectLoading = () => createSelector(
  selectAuthentication,
  (authenticationState) => authenticationState.get('loading')
);

const makeSelectError = () => createSelector(
  selectAuthentication,
  (authenticationState) => authenticationState.get('error')
);

const makeSelectErrorEnum = () => createSelector(
  selectAuthentication,
  (authenticationState) => authenticationState.get('errorEnum')
);

export {
  selectAuthentication,
  makeSelectLoading,
  makeSelectError,
  makeSelectErrorEnum
};
