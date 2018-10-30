import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form } from 'antd';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { signIn } from './actions';
import reducer from './reducer';
import saga from './saga';
import AuthenticationPage from './AuthenticationPage';
import '../../shared/services/localforage.service';


const mapDispatchToProps = (dispatch) => ({
  onSignIn: (params) => dispatch(signIn(params)),
});

const withForm = Form.create();
const withConnect = connect(undefined, mapDispatchToProps);
const withReducer = injectReducer({ key: 'authentication', reducer });
const withSaga = injectSaga({ key: 'authentication', saga });

export default compose(withReducer, withSaga, withConnect, withForm)(AuthenticationPage);
export { mapDispatchToProps };
