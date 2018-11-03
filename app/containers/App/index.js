import { createStructuredSelector } from 'reselect';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { makeSelectError, makeSelectLoading } from './selectors';
import { initApp, initAppSuccess } from './actions';
import App from './App';
import { updateUser } from '../AuthenticationPage/actions';

const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const mapDispatchToProps = (dispatch) => ({
  initApp: () => dispatch(initApp()),
  initAppSuccess: () => dispatch(initAppSuccess()),
  updateUser: (user) => dispatch(updateUser(user))
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRouter, withConnect)(App);
export { mapDispatchToProps };

