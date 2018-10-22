import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types'
import './style.scss';

const LoadingIndicator = (props) => (
  <div className="LoadingIndicator">
    <Spin size={props.size || 'large'} />
  </div>
);

LoadingIndicator.propTypes = {
  size: PropTypes.string,
};

export default LoadingIndicator;
