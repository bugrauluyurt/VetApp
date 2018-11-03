import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Form } from 'antd';
import injectSaga from 'utils/injectSaga';
import { signIn } from './actions';
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
const withSaga = injectSaga({ key: 'user', saga });

export default compose(withSaga, withConnect, withForm)(AuthenticationPage);
export { mapDispatchToProps };
