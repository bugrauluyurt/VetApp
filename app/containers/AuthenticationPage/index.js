import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Form } from 'antd';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { signIn } from './actions';
import reducer from './reducer';
import { makeSelectLoading, makeSelectError, makeSelectErrorEnum } from './selectors';
import saga from './saga';
import AuthenticationPage from './AuthenticationPage';
import '../../shared/services/localforage.service';


const mapStateToProps = createStructuredSelector({
  loading: makeSelectLoading(),
  error: makeSelectError(),
  errorEnum: makeSelectErrorEnum(),
});

const mapDispatchToProps = (dispatch) => ({
  onSignIn: (params) => dispatch(signIn(params)),
});

const withForm = Form.create();
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'authentication', reducer });
const withSaga = injectSaga({ key: 'authentication', saga });

export default compose(withReducer, withSaga, withConnect, withForm)(AuthenticationPage);
export { mapDispatchToProps };
