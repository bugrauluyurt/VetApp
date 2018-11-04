import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { instance as AuthenticationService } from '../../shared/services/auth.service';
import './style.scss';
import renderRoutes from '../../routes';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.props.initApp();
    // Put all initial api calls into promise.all
    Promise.all([
      this.initAuthentication()
    ]).then(([authenticationResponse]) => {
      if (authenticationResponse.user) {
        this.hydrateStore(authenticationResponse.user);
      }
      this.props.initAppSuccess();
    });
  }

  initAuthentication() {
    return AuthenticationService.initiate();
  }

  hydrateStore(user) {
    this.props.updateUser(user);
  }

  render() {
    const { loading, error } = this.props;
    return (
      <div className="App">
        <Helmet
          titleTemplate="%s - VetCMS Application"
          defaultTitle="VetCMS Application"
        >
          <meta name="description" content="VetCMS Application" />
        </Helmet>
        <div className="App__wrapper">
          { loading && <div className="loading"><Spin size="large" /></div> }
          { !loading && !error && renderRoutes() }
          { !loading && error && (
            <div className="error">
              <p>An error occured while loading the app please retry</p>
              <button onClick={this.init}>Retry</button>
            </div>
          ) }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  updateUser: PropTypes.func,
  initApp: PropTypes.func,
  initAppSuccess: PropTypes.func,
  error: PropTypes.bool,
  loading: PropTypes.bool,
};

export default App;
