import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

const Home = ({ isAuthenticated, loading }) => {
  if (loading) {
    return <LinearProgress color="secondary" />;
  } else {
    return isAuthenticated ? (
      <Redirect to="/welcome" />
    ) : (
      <Redirect to="/register" />
    );
  }
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.users.isAuthenticated,
  loading: state.users.loading
});

export default connect(mapStateToProps, {})(Home);
