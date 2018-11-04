import React from 'react';
import PropTypes from 'prop-types';
import { instance as LoggerService } from '../services/logger.service';
import { instance as AuthService } from '../services/auth.service';
import { ROUTE_PATH_AUTHENTICATION } from '../constants';

export default function withRouteProtection(WrappedComponent) {
  class ProtectedRoute extends React.Component {
    componentWillMount() {
      LoggerService.log(this.props.location.pathname, 'Loading Protected Route');
      if (!AuthService.isAuthenticated()) {
        this.props.history.push(ROUTE_PATH_AUTHENTICATION);
      }
    }
    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }
  ProtectedRoute.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
  };

  return ProtectedRoute;
}
