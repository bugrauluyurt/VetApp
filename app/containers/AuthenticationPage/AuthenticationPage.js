import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Alert } from 'antd';
import PropTypes from 'prop-types';
import { instance as AuthService } from '../../shared/services/auth.service'
import './style.scss';
import { instance as LoggerService } from '../../shared/services/logger.service';
import { FORM_ICON_STYLE, ROUTE_PATH_DEFAULT } from '../../shared/constants';

const FormItem = Form.Item;

class AuthenticationPage extends React.Component {
  componentWillMount() {
    if (AuthService.isAuthenticated()) {
      this.props.history.push(ROUTE_PATH_DEFAULT);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        LoggerService.log(values, 'Received values of form');
        this.props.onSignIn(values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, error, errorEnum } = this.props;
    return (
      <div className="AuthenticationPage">
        <div className="form-wrapper">
          { error && <Alert message={errorEnum} type="error" /> }
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={FORM_ICON_STYLE} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={FORM_ICON_STYLE} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('rememberMe', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              <a className="login-form-forgot" href="">Forgot password</a>
              <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                Log in
              </Button>
              <span>Or </span>
              <a href="">register now!</a>
            </FormItem>
          </Form>
        </div>
      </div>

    );
  }
}

AuthenticationPage.propTypes = {
  onSignIn: PropTypes.func,
  form: PropTypes.object,
  errorEnum: PropTypes.string,
  error: PropTypes.bool,
  loading: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default AuthenticationPage;
