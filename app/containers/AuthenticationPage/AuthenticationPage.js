import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';

const AuthenticationPage = () => (
  <div className="authentication-page-wrapper">
    <Helmet>
      <title>Login</title>
      <meta
        name="description"
        content="VetCMS Application"
      />
    </Helmet>
    <div className="authentication-page-body">AuthenticationPage Body</div>
  </div>
);

export default AuthenticationPage;
