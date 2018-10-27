import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { signIn } from './actions';
import reducer from './reducer';
import saga from './saga';
import AuthenticationPage from './AuthenticationPage';

const mapDispatchToProps = (dispatch) => ({
  onSignIn: (username, password, rememberMe) => dispatch(signIn(username, password, rememberMe)),
});

const withConnect = connect(undefined, mapDispatchToProps);

const withReducer = injectReducer({ key: 'authentication', reducer });
const withSaga = injectSaga({ key: 'authentication', saga });

export default compose(withReducer, withSaga, withConnect)(AuthenticationPage);
export { mapDispatchToProps };
