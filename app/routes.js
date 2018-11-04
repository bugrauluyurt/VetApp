import { Redirect, Route, Switch } from 'react-router-dom';
import React from 'react';
import AuthenticationModule from './containers/AuthenticationPage/Loadable';
import FeatureModule from './containers/FeaturePage/Loadable';
import NotFoundModule from './containers/NotFoundPage/Loadable';
import {
  ROUTE_PATH_AUTHENTICATION,
  ROUTE_PATH_DEFAULT,
  ROUTE_PATH_FEATURES,
  ROUTE_PATH_NOTFOUND,
} from './shared/constants';

const routes = [
  {
    path: ROUTE_PATH_AUTHENTICATION,
    component: AuthenticationModule,
  },
  {
    path: ROUTE_PATH_FEATURES,
    component: FeatureModule,
  },
  {
    path: ROUTE_PATH_NOTFOUND,
    component: NotFoundModule
  }
];

const renderRoutes = () => {
  const getRoute = (route, i) => (
    <Route
      key={`${i}_${route.path}`}
      path={route.path}
      render={(props) => (
        <route.component {...props} routes={route.routes} />
      )}
    />
  );

  return (
    <div className="routes">
      <Switch>
        <Redirect exact from={ROUTE_PATH_DEFAULT} to={ROUTE_PATH_FEATURES} />
        { routes.map((route, i) => getRoute(route, i)) }
      </Switch>
    </div>
  );
};

export default renderRoutes;
