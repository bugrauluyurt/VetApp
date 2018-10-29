/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import AuthenticationPage from 'containers/AuthenticationPage/Loadable';
import './style.scss';
import { ROUTE_PATH_AUTHENTICATION, ROUTE_PATH_FEATURES, ROUTE_PATH_ROOT } from '../../shared/constants';

const App = () => (
  <div className="app-wrapper">
    <Helmet
      titleTemplate="%s - VetCMS Application"
      defaultTitle="VetCMS Application"
    >
      <meta name="description" content="VetCMS Application" />
    </Helmet>
    <Switch>
      <Route exact path={ROUTE_PATH_ROOT} component={HomePage} />
      <Route path={ROUTE_PATH_AUTHENTICATION} component={AuthenticationPage} />
      <Route path={ROUTE_PATH_FEATURES} component={FeaturePage} />
      <Route path="" component={NotFoundPage} />
    </Switch>
  </div>
);

export default App;
