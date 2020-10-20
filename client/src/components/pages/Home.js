import React, { useEffect, Fragment } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadUser2 } from '../../actions/userActions';
import { Redirect } from 'react-router-dom';

const Home = ({ loadUser, isAuthenticated }) => {
  useEffect(() => {
    loadUser2();

    // eslint-disable-next-line
  }, [isAuthenticated]);

  return isAuthenticated ? (
    <Redirect to="/welcome" />
  ) : (
    <Redirect to="/register" />
  );
};

Home.propTypes = {
  loadUser2: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated
});

export default connect(mapStateToProps, {
  loadUser2
})(Home);
